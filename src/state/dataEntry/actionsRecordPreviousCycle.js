import { Records } from "@openforis/arena-core";

import { Cycles } from "model/Cycles";
import { RecordService } from "service/recordService";
import { ToastActions } from "state/toast";
import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { DataEntryActionTypes } from "./actionTypes";

const fetchRecordFromPreviousCycle = async ({ dispatch, survey, record }) => {
  const rootEntity = Records.getRoot(record);
  const keyValues = Records.getEntityKeyValues({
    survey,
    record,
    entity: rootEntity,
  });
  const prevCycle = Cycles.getPrevCycleKey(record.cycle);
  const prevCycleRecordIds = await RecordService.findRecordIdsByKeys({
    survey,
    cycle: prevCycle,
    keyValues,
  });
  if (prevCycleRecordIds.length === 0) {
    dispatch({ type: DataEntryActionTypes.RECORD_PREVIOUS_CYCLE_RESET });
    dispatch(
      ToastActions.show({ textKey: "dataEntry:previousCycleRecordNotFound" })
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
      ToastActions.show({ textKey: "dataEntry:previousCycleRecordFound" })
    );

    dispatch(updatePreviousCyclePageEntity);
  } else {
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:previousCycleMultipleRecordsFound",
      })
    );
  }
};

const linkToRecordInPreviousCycle = () => async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const record = DataEntrySelectors.selectRecord(state);
  await fetchRecordFromPreviousCycle({ dispatch, survey, record });
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
  fetchRecordFromPreviousCycle,
  linkToRecordInPreviousCycle,
  unlinkFromRecordInPreviousCycle,
  updatePreviousCyclePageEntity,
};
