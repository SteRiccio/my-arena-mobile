import { JobStatus } from "@openforis/arena-core";

import { RecordService } from "service/recordService";
import { RecordsAndFilesImportJob } from "service/recordsAndFilesImportJob";
import { JobMonitorActions } from "../jobMonitor/actions";
import { RemoteConnectionSelectors } from "../remoteConnection/selectors";
import { SurveySelectors } from "../survey/selectors";
import { ToastActions } from "../toast";

const handleImportErrors = ({ dispatch, error = null, errors = null }) => {
  const details = error?.toString() ?? JSON.stringify(errors);
  dispatch(
    ToastActions.show({
      textKey: "dataEntry:records.importFailed",
      textParams: { details },
    })
  );
};

const _onExportFromServerJobComplete = async ({
  dispatch,
  state,
  job,
  onImportComplete,
}) => {
  try {
    const { outputFileName: fileName } = job.result;

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
      await onImportComplete();
    } else {
      handleImportErrors({ dispatch, errors });
    }
  } catch (error) {
    handleImportErrors({ dispatch, error });
  }
};

export const importRecordsFromServer =
  ({ recordUuids, onImportComplete }) =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const survey = SurveySelectors.selectCurrentSurvey(state);
      const cycle = SurveySelectors.selectCurrentSurveyCycle(state);

      const job = await RecordService.startExportRecordsFromRemoteServer({
        survey,
        cycle,
        recordUuids,
      });
      const jobComplete = await JobMonitorActions.startAsync({
        dispatch,
        jobUuid: job.uuid,
        titleKey: "dataEntry:records.importRecords.title",
      });
      await _onExportFromServerJobComplete({
        dispatch,
        state,
        job: jobComplete,
        onImportComplete,
      });
    } catch (error) {
      handleImportErrors({ dispatch, error, errors });
    }
  };
