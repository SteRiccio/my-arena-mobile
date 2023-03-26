import { StoreUtils } from "../storeUtils";
import { RemoteConnectionActions } from "./actions";

const initialState = {};

const actionHandlers = {
  [RemoteConnectionActions.LOGGED_IN]: ({ state, action }) => ({
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
