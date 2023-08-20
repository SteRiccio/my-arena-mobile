import { JobStatus, Surveys } from "@openforis/arena-core";

import { AuthService, RecordService, WebSocketService } from "service";
import { RecordsExportFileGenerationJob } from "service/recordsExportFileGenerationJob";

import { i18n } from "localization";
import { ConfirmActions, JobMonitorActions, MessageActions } from "state";
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
  ({ outputFileUri }) =>
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
        })
      );
    } catch (error) {
      dispatch(handleError(error));
    }
  };

const onExportConfirmed =
  ({ selectedSingleChoiceValue, outputFileUri }) =>
  async (dispatch) => {
    try {
      if (selectedSingleChoiceValue === exportType.remote) {
        dispatch(startUploadDataToRemoteServer({ outputFileUri }));
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

export const exportRecords =
  ({ recordUuids }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);

    //  const fileUri = "content://com.android.externalstorage.documents/tree/primary%3ADownload/document/primary%3ADownload%2Farena_mobile_export_testi_4_2023-07-10_08-02-48.zip";
    // const fileInfo = await getInfoAsync(fileUri);
    // console.log(fileInfo)

    // const remoteJob = await RecordService.uploadRecordsToRemoteServer({
    //       survey,
    //       cycle,
    //       fileUri,
    //     });
    // const jobUuid = remoteJob?.uuid
    // dispatch(JobMonitorActions.start({jobUuid, titleKey: 'dataEntry:exportData'}))

    try {
      const user = await AuthService.fetchUser();
      // TODO if user is null, do login

      const job = new RecordsExportFileGenerationJob({
        survey,
        recordUuids,
        user,
      });
      await job.start();
      const { summary } = job;
      const { errors, result, status } = summary;

      if (status === JobStatus.failed) {
        const validationErrors = Object.values(errors).map(
          (item) => item.error
        );
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
      } else if (status === JobStatus.succeeded) {
        const { outputFileUri } = result || {};
        // const { size: fileSize } = await Files.getInfo(outputFileUri);

        const availableExportTypes = [
          exportType.remote,
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
                onExportConfirmed({ selectedSingleChoiceValue, outputFileUri })
              );
            },
            singleChoiceOptions: availableExportTypes.map((type) => ({
              value: type,
              label: `dataEntry:dataExport.target.${type}`,
            })),
            defaultSingleChoiceValue: exportType.remote,
            confirmButtonTextKey: "common:export",
          })
        );
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
