import { Records } from "@openforis/arena-core";

import { Cycles, RecordNodes } from "model";
import { RecordService } from "service/recordService";
import { ToastActions } from "state/toast";
import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { DataEntryActionTypes } from "./actionTypes";
import { ConfirmActions } from "..";

const _fetchRecordFromPreviousCycleAndLinkIt = async ({
  dispatch,
  survey,
  record,
  lang,
}) => {
  const rootEntity = Records.getRoot(record);
  const { cycle } = record;
  const prevCycle = Cycles.getPrevCycleKey(cycle);
  const prevCycleString = Cycles.labelFunction(prevCycle);
  const keyValues = Records.getEntityKeyValues({
    survey,
    cycle,
    record,
    entity: rootEntity,
  });
  const keyValuesFormatted = RecordNodes.getRootEntityKeysFormatted({
    survey,
    record,
    lang,
  });
  const keyValuesString = keyValuesFormatted.join(", ");

  const prevCycleRecordIds = await RecordService.findRecordIdsByKeys({
    survey,
    cycle: prevCycle,
    keyValues,
    keyValuesFormatted,
  });

  if (prevCycleRecordIds.length === 0) {
    dispatch(unlinkFromRecordInPreviousCycle());
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:recordInPreviousCycle.notFoundMessage",
        textParams: {
          cycle: prevCycleString,
          keyValues: keyValuesString,
        },
      })
    );
  } else if (prevCycleRecordIds.length === 1) {
    const prevCycleRecordId = prevCycleRecordIds[0];
    const prevCycleRecord = await RecordService.fetchRecord({
      survey,
      recordId: prevCycleRecordId,
    });
    await dispatch({
      type: DataEntryActionTypes.RECORD_PREVIOUS_CYCLE_SET,
      record: prevCycleRecord,
    });

    dispatch(
      ToastActions.show({
        textKey: "dataEntry:recordInPreviousCycle.foundMessage",
      })
    );

    dispatch(updatePreviousCyclePageEntity);
  } else {
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:recordInPreviousCycle.multipleRecordsFoundMessage",
        textParams: {
          cycle: prevCycleString,
          keyValues: keyValuesString,
        },
      })
    );
  }
  return { keyValues: keyValuesString, prevCycle, prevCycleRecordIds };
};

const linkToRecordInPreviousCycle = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const lang = SurveySelectors.selectCurrentSurveyPreferredLang(state);
    const fetchRecordFromPreviousCycleInternal = async () =>
      _fetchRecordFromPreviousCycleAndLinkIt({
        dispatch,
        survey,
        record,
        lang,
      });
    const { keyValues, prevCycle, prevCycleRecordIds } =
      await fetchRecordFromPreviousCycleInternal();
    if (prevCycleRecordIds.length === 0) {
      // record in previous cycle not found: ask to to sync records list and try again
      dispatch(
        ConfirmActions.show({
          messageKey:
            "dataEntry:recordInPreviousCycle.confirmSyncRecordsSummaryAndTryAgain",
          messageParams: { cycle: Cycles.labelFunction(prevCycle), keyValues },
          onConfirm: async () => {
            await RecordService.syncRecordSummaries({
              survey,
              cycle: prevCycle,
            });
            await fetchRecordFromPreviousCycleInternal();
          },
        })
      );
    }
  } catch (error) {
    const details = `${error.toString()} - ${error.stack}`;
    ToastActions.show({
      textKey: "dataEntry:recordInPreviousCycleFetchError",
      textParams: { details },
    });
  }
};

const unlinkFromRecordInPreviousCycle = () => async (dispatch) => {
  dispatch({ type: DataEntryActionTypes.RECORD_PREVIOUS_CYCLE_RESET });
};

const updatePreviousCyclePageEntity = (dispatch, getState) => {
  const state = getState();
  const { parentEntityUuid, entityUuid } =
    DataEntrySelectors.selectCurrentPageEntity(state);

  const previousCycleParentEntity =
    DataEntrySelectors.selectPreviousCycleEntityWithSameKeys({
      entityUuid: parentEntityUuid,
    })(state);
  const previousCycleEntity =
    DataEntrySelectors.selectPreviousCycleEntityWithSameKeys({
      entityUuid,
    })(state);

  dispatch({
    type: DataEntryActionTypes.PREVIOUS_CYCLE_PAGE_ENTITY_SET,
    payload: {
      previousCycleParentEntityUuid: previousCycleParentEntity?.uuid,
      previousCycleEntityUuid: previousCycleEntity?.uuid,
    },
  });
};

export const DataEntryActionsRecordPreviousCycle = {
  linkToRecordInPreviousCycle,
  unlinkFromRecordInPreviousCycle,
  updatePreviousCyclePageEntity,
};
