import { SurveyActionTypes } from "state/survey";
import { StoreUtils } from "../storeUtils";

import { DataEntryActions } from "./actions";

const initialState = {
  record: null,
  recordCurrentPageEntity: null,
  recordPageSelectorMenuOpen: false,
};

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: () => ({ ...initialState }),
  [DataEntryActions.DATA_ENTRY_RESET]: () => ({ ...initialState }),

  [DataEntryActions.RECORD_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: false,
    record: action.record,
  }),
  [DataEntryActions.RECORD_PREVIOUS_CYCLE_SET]: ({ state, action }) => ({
    ...state,
    recordPreviousCycle: action.record,
  }),
  [DataEntryActions.PAGE_ENTITY_SET]: ({ state, action }) => {
    const { parentEntityUuid, entityDefUuid, entityUuid } = action;

    return {
      ...state,
      recordCurrentPageEntity: {
        parentEntityUuid,
        entityDefUuid,
        entityUuid,
      },
      activeChildDefIndex: 0,
    };
  },
  [DataEntryActions.PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET]: ({
    state,
    action,
  }) => ({ ...state, activeChildDefIndex: action.index }),
  [DataEntryActions.PAGE_SELECTOR_MENU_OPEN_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: action.open,
  }),
};

export const DataEntryReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
