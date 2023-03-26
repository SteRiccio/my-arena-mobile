import { StoreUtils } from "../storeUtils";
import { MessageActions } from "./actions";

const initialState = {};

const actionHandlers = {
  [MessageActions.MESSAGE_SET]: ({ state, action }) => ({
    ...state,
    content: action.content,
  }),
  [MessageActions.MESSAGE_DISMISSED]: () => ({
    ...initialState,
  }),
};

export const MessageReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
