import { RecordService } from "service/recordService";

import { SurveySelectors } from "state/survey";
import { ToastActions } from "state/toast";

export const cloneRecordsIntoDefaultCycle =
  ({ recordSummaries }) =>
  async (dispatch, getState) => {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    await RecordService.cloneRecordsIntoDefaultCycle({
      survey,
      recordSummaries,
    });
    dispatch(
      ToastActions.show("dataEntry:records.cloneRecords.completeSuccessfully", {
        cycle: prevCycleString,
        keyValues: keyValuesString,
      })
    );
  };
