import { StoreUtils } from "../storeUtils";
import { RemoteConnectionActions } from "./actions";

const initialState = {};

const actionHandlers = {
  [RemoteConnectionActions.USER_SET]: ({ state, action }) => ({
    ...state,
    user: action.user,
  }),
  [RemoteConnectionActions.LOGGED_OUT]: () => ({
    ...initialState,
  }),
};

export const RemoteConnectionReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
