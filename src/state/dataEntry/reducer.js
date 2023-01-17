import { StoreUtils } from "../storeUtils";

import { DataEntryActions } from "./actions";

const actionHandlers = {
  [DataEntryActions.CURRENT_RECORD_SET]: ({ state, action }) => ({
    ...state,
    currentRecord: action.record,
  }),
};

export const DataEntryReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState: false,
});
