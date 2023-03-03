import { StoreUtils } from "../storeUtils";

import { DataEntryActions } from "./actions";

const actionHandlers = {
  [DataEntryActions.CURRENT_RECORD_SET]: ({ state, action }) => ({
    ...state,
    currentRecord: action.record,
  }),
  [DataEntryActions.CURRENT_PAGE_NODE_SET]: ({ state, action }) => {
    const { parentNodeUuid, nodeDefUuid, nodeUuid } = action;

    return {
      ...state,
      recordCurrentPageNode: {
        parentNodeUuid,
        nodeDefUuid,
        nodeUuid,
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
