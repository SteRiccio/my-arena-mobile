import { StoreUtils } from "../storeUtils";

import { DataEntryActions } from "./actions";

const actionHandlers = {
  [DataEntryActions.CURRENT_RECORD_SET]: ({ state, action }) => ({
    ...state,
    currentRecord: action.record,
  }),
  [DataEntryActions.ENTITY_IN_PAGE_SET]: ({ state, action }) => ({
    ...state,
    selectedEntityUuidByPageUuid: {
      ...state.selectedEntityUuidByPageUuid,
      [action.pageUuid]: action.entityUuid,
    },
  }),
  [DataEntryActions.PAGE_SELECTOR_MENU_OPEN_SET]: ({ state, action }) => ({
    ...state,
    recordPageSelectorMenuOpen: action.open,
  }),
};

export const DataEntryReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState: false,
});
