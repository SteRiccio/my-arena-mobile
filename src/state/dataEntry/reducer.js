import { SurveyActionTypes } from "state/survey";
import { StoreUtils } from "../storeUtils";

import { DataEntryActions } from "./actions";

const actionHandlers = {
  [SurveyActionTypes.CURRENT_SURVEY_SET]: () => ({}),
  [DataEntryActions.DATA_ENTRY_RESET]: () => ({}),

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
    };
  },
  [DataEntryActions.PAGE_SELECTOR_MENU_OPEN_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: action.open,
  }),
};

export const DataEntryReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState: false,
});
