import { JobStatus } from "@openforis/arena-core";

import { RecordOrigin } from "model";
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

const _onExportFromServerJobComplete =
  ({ job, onImportComplete }) =>
  async (dispatch, getState) => {
    try {
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
      dispatch(
        JobMonitorActions.start({
          jobUuid: job.uuid,
          titleKey: "dataEntry:records.importRecords.title",
          onJobComplete: (jobComplete) =>
            dispatch(
              _onExportFromServerJobComplete({
                job: jobComplete,
                onImportComplete,
              })
            ),
        })
      );
    } catch (error) {
      handleImportErrors({ dispatch, error, errors });
    }
  };
