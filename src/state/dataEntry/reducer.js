import { SurveyActionTypes } from "state/survey";
import { StoreUtils } from "../storeUtils";

import { DataEntryActionTypes } from "./actionTypes";

const initialState = {
  record: null,
  recordCurrentPageEntity: null,
  recordPageSelectorMenuOpen: false,
};

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: () => ({ ...initialState }),
  [DataEntryActionTypes.DATA_ENTRY_RESET]: () => ({ ...initialState }),

  [DataEntryActionTypes.RECORD_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: false,
    record: action.record,
  }),
  [DataEntryActionTypes.PAGE_ENTITY_SET]: ({ state, action }) => ({
    ...state,
    recordCurrentPageEntity: action.payload,
    activeChildDefIndex: 0,
  }),
  [DataEntryActionTypes.PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET]: ({
    state,
    action,
  }) => ({ ...state, activeChildDefIndex: action.index }),
  [DataEntryActionTypes.PAGE_SELECTOR_MENU_OPEN_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: action.open,
  }),
};

export const DataEntryReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
