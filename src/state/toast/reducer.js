import { StoreUtils } from "../storeUtils";
import { ToastActions } from "./actions";

const initialState = {};

const actionHandlers = {
  [ToastActions.TOAST_SET]: ({ state, action }) => ({
    ...state,
    textKey: action.textKey,
    textParams: action.textParams,
  }),
  [ToastActions.TOAST_DISMISSED]: () => ({
    ...initialState,
  }),
};

export const ToastReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
