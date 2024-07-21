import { Records, Surveys } from "@openforis/arena-core";

import { Cycles, RecordLoadStatus, RecordNodes, RecordOrigin } from "model";
import { RecordService } from "service";
import { ToastActions } from "../toast";
import { ConfirmActions } from "../confirm";
import { SurveySelectors } from "../survey";

import { DataEntrySelectors } from "./selectors";
import { DataEntryActionTypes } from "./actionTypes";
import { importRecordsFromServer } from "./actionsRecordsImport";

const {
  PREVIOUS_CYCLE_PAGE_ENTITY_SET,
  RECORD_PREVIOUS_CYCLE_LOAD,
  RECORD_PREVIOUS_CYCLE_SET,
  RECORD_PREVIOUS_CYCLE_RESET,
} = DataEntryActionTypes;

const _fetchRecordFromPreviousCycleAndLinkItInternal = async ({
  dispatch,
  survey,
  recordId,
}) => {
  dispatch({ type: RECORD_PREVIOUS_CYCLE_LOAD, loading: true });

  const record = await RecordService.fetchRecord({ survey, recordId });
  const { loadStatus, origin } = record;
  const loaded =
    origin !== RecordOrigin.remote || loadStatus === RecordLoadStatus.complete;

  if (loaded) {
    await dispatch({ type: RECORD_PREVIOUS_CYCLE_SET, record });
    dispatch(ToastActions.show("dataEntry:recordInPreviousCycle.foundMessage"));
    dispatch(updatePreviousCyclePageEntity);
  }
  dispatch({ type: RECORD_PREVIOUS_CYCLE_LOAD, loading: false });
  return loaded;
};

const _fetchRecordFromPreviousCycleAndLinkIt = async ({
  dispatch,
  survey,
  record,
  prevCycle,
  lang,
}) => {
  dispatch({ type: RECORD_PREVIOUS_CYCLE_LOAD, loading: true });

  const rootEntity = Records.getRoot(record);
  const { cycle } = record;
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
      ToastActions.show("dataEntry:recordInPreviousCycle.notFoundMessage", {
        cycle: prevCycleString,
        keyValues: keyValuesString,
      })
    );
  } else if (prevCycleRecordIds.length === 1) {
    const prevCycleRecordId = prevCycleRecordIds[0];
    const doFetch = async () =>
      _fetchRecordFromPreviousCycleAndLinkItInternal({
        dispatch,
        survey,
        recordId: prevCycleRecordId,
      });
    if (!(await doFetch())) {
      const { uuid: recordUuid } = record;
      dispatch(
        ConfirmActions.show({
          messageKey:
            "dataEntry:recordInPreviousCycle.confirmFetchRecordInCycle",
          messageParams: { cycle: prevCycleString, keyValues },
          onConfirm: () => {
            dispatch(
              importRecordsFromServer({
                recordUuids: [recordUuid],
                onImportComplete: doFetch,
              })
            );
          },
        })
      );
    }
  } else {
    dispatch(
      ToastActions.show(
        "dataEntry:recordInPreviousCycle.multipleRecordsFoundMessage",
        {
          cycle: prevCycleString,
          keyValues: keyValuesString,
        }
      )
    );
  }
  dispatch({ type: RECORD_PREVIOUS_CYCLE_LOAD, loading: false });

  return { keyValues: keyValuesString, prevCycleRecordIds };
};

const linkToRecordInPreviousCycle = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const survey = SurveySelectors.selectCurrentSurvey(state);
    const record = DataEntrySelectors.selectRecord(state);
    const { cycle: cycleKey } = record;
    const prevCycleKeys = Cycles.getPrevCycleKeys({ survey, cycleKey });
    const confirmKeysPrefix =
      "dataEntry:recordInPreviousCycle.confirmShowValuesPreviousCycle.";
    dispatch(
      ConfirmActions.show({
        titleKey: `${confirmKeysPrefix}title`,
        messageKey: `${confirmKeysPrefix}message`,
        singleChoiceOptions: prevCycleKeys.map((cycleKey) => ({
          value: cycleKey,
          label: Cycles.labelFunction(cycleKey),
        })),
        defaultSingleChoiceValue: Cycles.getPrevCycleKey(cycleKey),
        onConfirm: async ({ selectedSingleChoiceValue: selectedCycleKey }) => {
          const lang = SurveySelectors.selectCurrentSurveyPreferredLang(state);
          const fetchRecordFromPreviousCycleInternal = async () =>
            _fetchRecordFromPreviousCycleAndLinkIt({
              dispatch,
              survey,
              record,
              prevCycle: selectedCycleKey,
              lang,
            });

          dispatch(ConfirmActions.dismiss());

          const { keyValues, prevCycleRecordIds } =
            await fetchRecordFromPreviousCycleInternal();

          if (prevCycleRecordIds.length === 0) {
            // record in previous cycle not found: ask to to sync records list and try again
            dispatch(
              ConfirmActions.show({
                messageKey:
                  "dataEntry:recordInPreviousCycle.confirmSyncRecordsSummaryAndTryAgain",
                messageParams: {
                  cycle: Cycles.labelFunction(prevCycle),
                  keyValues,
                },
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
        },
      })
    );
  } catch (error) {
    const details = `${error.toString()} - ${error.stack}`;
    ToastActions.show("dataEntry:recordInPreviousCycleFetchError", { details });
  }
};

const unlinkFromRecordInPreviousCycle = () => async (dispatch) => {
  dispatch({ type: RECORD_PREVIOUS_CYCLE_RESET });
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
    type: PREVIOUS_CYCLE_PAGE_ENTITY_SET,
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
