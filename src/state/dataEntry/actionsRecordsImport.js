import { JobStatus } from "@openforis/arena-core";

import { RecordOrigin } from "model";
import { RecordService } from "service/recordService";
import { RecordsAndFilesImportJob } from "service/recordsAndFilesImportJob";
import { JobMonitorActions } from "../jobMonitor/actions";
import { RemoteConnectionSelectors } from "../remoteConnection/selectors";
import { SurveySelectors } from "../survey/selectors";
import { ToastActions } from "../toast";

const onExportFromServerJobComplete = (job) => async (dispatch, getState) => {
  const { outputFileName: fileName } = job.result;

  const state = getState();
  const user = RemoteConnectionSelectors.selectLoggedUser(state);
  const survey = SurveySelectors.selectCurrentSurvey(state);

  dispatch(JobMonitorActions.close());

  const fileUri =
    await RecordService.downloadExportedRecordsFileFromRemoteServer({
      survey,
      fileName,
    });

  const importJob = new RecordsAndFilesImportJob({
    survey,
    user,
    fileUri,
  });

  await importJob.start();

  const { status, errors } = importJob.summary;

  if (status === JobStatus.succeeded) {
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:records.importCompleteSuccessfully",
      })
    );
    // await loadRecords();
  } else {
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:records.importFailed",
        textParams: {
          details: status + " " + JSON.stringify(errors),
        },
      })
    );
  }
};

export const importRecordsFromServer =
  ({ recordSummaries }) =>
  async (dispatch, getState) => {
    if (
      recordSummaries.every((record) => record.origin === RecordOrigin.remote)
    ) {
      const state = getState();
      const survey = SurveySelectors.selectCurrentSurvey(state);
      const cycle = SurveySelectors.selectCurrentSurveyCycle(state);

      const job = await RecordService.startExportRecordsFromRemoteServer({
        survey,
        cycle,
        recordUuids: recordSummaries.map((record) => record.uuid),
      });
      dispatch(
        JobMonitorActions.start({
          jobUuid: job.uuid,
          titleKey: "dataEntry:records.downloadRecords.title",
          onJobComplete: (jobComplete) =>
            dispatch(onExportFromServerJobComplete(jobComplete)),
        })
      );
    }
  };
