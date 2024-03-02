import { JobStatus, Surveys } from "@openforis/arena-core";

import { AuthService, RecordService, WebSocketService } from "service";
import { RecordsExportFileGenerationJob } from "service/recordsExportFileGenerationJob";

import { i18n } from "localization";
import { ConfirmActions } from "../confirm";
import { JobMonitorActions } from "../jobMonitor";
import { MessageActions } from "../message";

import { SurveySelectors } from "../survey";
import { Files } from "utils";
import { Validations } from "model/utils/Validations";

const { t } = i18n;

const exportType = {
  remote: "remote",
  local: "local",
  share: "share",
};

const handleError = (error) => (dispatch) =>
  dispatch(
    MessageActions.setMessage({
      content: "dataEntry:dataExport.error",
      contentParams: { details: error.toString() },
    })
  );

const startUploadDataToRemoteServer =
  ({ outputFileUri, onJobComplete = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const cycle = Surveys.getDefaultCycleKey(survey);

    try {
      const remoteJob = await RecordService.uploadRecordsToRemoteServer({
        survey,
        cycle,
        fileUri: outputFileUri,
      });

      dispatch(
        JobMonitorActions.start({
          jobUuid: remoteJob.uuid,
          titleKey: "dataEntry:exportData",
          onClose: () => WebSocketService.close(),
          onJobComplete,
        })
      );
    } catch (error) {
      dispatch(handleError(error));
    }
  };

const onExportConfirmed =
  ({ selectedSingleChoiceValue, outputFileUri, onJobComplete }) =>
  async (dispatch) => {
    try {
      if (selectedSingleChoiceValue === exportType.remote) {
        dispatch(
          startUploadDataToRemoteServer({ outputFileUri, onJobComplete })
        );
      } else if (selectedSingleChoiceValue === exportType.local) {
        const res = await Files.moveFileToDownloadFolder(outputFileUri);
        if (!res) {
          throw new Error("Permission denied");
        }
      } else {
        await Files.shareFile({
          url: outputFileUri,
          mimeType: Files.MIME_TYPES.zip,
          dialogTitle: t("dataEntry:dataExport.shareExportedFile"),
        });
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };

const _onExportFileGenerationError = ({ errors, dispatch }) => {
  const validationErrors = Object.values(errors).map((item) => item.error);
  const details = validationErrors
    .map((validationError) =>
      Validations.getJointErrorText({
        validation: validationError,
        t,
      })
    )
    .join(";\n");
  dispatch(
    MessageActions.setMessage({
      content: "dataEntry:errorGeneratingRecordsExportFile",
      contentParams: { details },
    })
  );
};

const _onExportFileGenerationSucceeded = async ({
  result,
  onlyLocally,
  onJobComplete,
  dispatch,
}) => {
  const { outputFileUri } = result || {};
  // const { size: fileSize } = await Files.getInfo(outputFileUri);
  const availableExportTypes = [
    ...(onlyLocally ? [] : [exportType.remote]),
    // exportType.local,
    ...((await Files.isSharingAvailable()) ? [exportType.share] : []),
  ];

  dispatch(
    ConfirmActions.show({
      titleKey: "dataEntry:dataExport.selectTarget",
      messageKey: "dataEntry:dataExport.selectTargetMessage",
      // messageParams: {
      //   fileSize: Files.toHumanReadableFileSize(fileSize),
      // },
      onConfirm: ({ selectedSingleChoiceValue }) => {
        dispatch(
          onExportConfirmed({
            selectedSingleChoiceValue,
            outputFileUri,
            onJobComplete,
          })
        );
      },
      singleChoiceOptions: availableExportTypes.map((type) => ({
        value: type,
        label: `dataEntry:dataExport.target.${type}`,
      })),
      defaultSingleChoiceValue: availableExportTypes[0],
      confirmButtonTextKey: "common:export",
    })
  );
};

export const exportRecords =
  ({ recordUuids, onlyLocally = false, onJobComplete = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);

    try {
      const user = onlyLocally ? {} : await AuthService.fetchUser();

      const job = new RecordsExportFileGenerationJob({
        survey,
        recordUuids,
        user,
      });
      await job.start();
      const { summary } = job;
      const { errors, result, status } = summary;

      if (status === JobStatus.failed) {
        _onExportFileGenerationError({ errors, dispatch });
      } else if (status === JobStatus.succeeded) {
        await _onExportFileGenerationSucceeded({
          result,
          onlyLocally,
          onJobComplete,
          dispatch,
        });
      } else {
        dispatch(
          MessageActions.setMessage({
            content: `Job status: ${status}`,
          })
        );
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
