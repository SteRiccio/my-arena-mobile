import { Records } from "@openforis/arena-core";

import { Cycles } from "model/Cycles";
import { RecordService } from "service/recordService";
import { ToastActions } from "state/toast";
import { SurveySelectors } from "../survey/selectors";
import { DataEntrySelectors } from "./selectors";
import { DataEntryActionTypes } from "./actionTypes";
import { RecordNodes } from "model/index";

const fetchRecordFromPreviousCycle = async ({ dispatch, survey, record }) => {
  const rootEntity = Records.getRoot(record);
  const { cycle } = record;
  const prevCycle = Cycles.getPrevCycleKey(cycle);

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
    dispatch({ type: DataEntryActionTypes.RECORD_PREVIOUS_CYCLE_RESET });
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:recordInCycleWithKeysNotFound",
        textParams: {
          cycle: prevCycle,
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
      ToastActions.show({ textKey: "dataEntry:recordInPreviousCycleFound" })
    );

    dispatch(updatePreviousCyclePageEntity);
  } else {
    dispatch(
      ToastActions.show({
        textKey: "dataEntry:multipleRecordsFoundInCycleWithKeys",
        textParams: {
          cycle: prevCycle,
          keyValues: keyValuesString,
        },
      })
    );
  }
};

const linkToRecordInPreviousCycle = () => async (dispatch, getState) => {
  const state = getState();
  const survey = SurveySelectors.selectCurrentSurvey(state);
  const lang = SurveySelectors.selectCurrentSurveyPreferredLang(state);
  const record = DataEntrySelectors.selectRecord(state);
  await fetchRecordFromPreviousCycle({ dispatch, survey, record, lang });
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
