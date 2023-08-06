import { SurveyActionTypes } from "state/survey";
import { StoreUtils } from "../storeUtils";

import { DataEntryActions } from "./actions";
import { RecordEditViewMode } from "model/RecordEditViewMode";

const initialState = {
  recordEditViewMode: RecordEditViewMode.form,
};

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: () => ({ ...initialState }),
  [DataEntryActions.DATA_ENTRY_RESET]: () => ({ ...initialState }),

  [DataEntryActions.CURRENT_RECORD_SET]: ({ state, action }) => ({
    ...state,
    currentRecord: action.record,
  }),
  [DataEntryActions.CURRENT_PAGE_ENTITY_SET]: ({ state, action }) => {
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
  [DataEntryActions.CURRENT_PAGE_ENTITY_ACTIVE_CHILD_INDEX_SET]: ({
    state,
    action,
  }) => ({ ...state, activeChildDefIndex: action.index }),
  [DataEntryActions.PAGE_SELECTOR_MENU_OPEN_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: action.open,
  }),
  [DataEntryActions.RECORD_EDIT_VIEW_MODE_SET]: ({ state, action }) => ({
    ...state,
    recordEditViewMode: action.viewMode,
  }),
};

export const DataEntryReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
