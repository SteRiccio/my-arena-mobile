import { JobStatus, Surveys, Validations } from "@openforis/arena-core";

import { AuthService, RecordService, WebSocketService } from "service";
import { RecordsExportFileGenerationJob } from "service/recordsExportFileGenerationJob";

import { ConfirmActions, JobMonitorActions, MessageActions } from "state";
import { SurveySelectors } from "../survey";
import { Files } from "utils";

const startUploadDataToRemoteServer =
  ({ outputFileUri }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const cycle = Surveys.getDefaultCycleKey(survey);

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
  };

const onExportConfirmed =
  ({ selectedSingleChoiceValue, outputFileUri }) =>
  async (dispatch) => {
    if (selectedSingleChoiceValue === "remote") {
      await dispatch(startUploadDataToRemoteServer({ outputFileUri }));
    } else if (selectedSingleChoiceValue === "local") {
      await Files.moveFileToDownloadFolder(outputFileUri);
    } else {
      await Files.shareFile({
        url: outputFileUri,
        mimeType: Files.MIME_TYPES.zip,
        dialogTitle: t("dataEntry:dataExport.shareExportedFile"),
      });
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
    } else if (status === JobStatus.succeeded) {
      const { outputFileUri } = result || {};
      dispatch(
        ConfirmActions.show({
          titleKey: "dataEntry:dataExport.selectTarget",
          messageKey: "dataEntry:dataExport.selectTargetMessage",
          onConfirm: async ({ selectedSingleChoiceValue }) => {
            await dispatch(
              onExportConfirmed({ selectedSingleChoiceValue, outputFileUri })
            );
          },
          singleChoiceOptions: [
            { value: "remote", label: "dataEntry:dataExport.target.remote" },
            { value: "local", label: "dataEntry:dataExport.target.local" },
            ...((await Files.isSharingAvailable())
              ? [{ value: "share", label: "dataEntry:dataExport.target.share" }]
              : []),
          ],
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
  };
