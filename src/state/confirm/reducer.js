import { StoreUtils } from "../storeUtils";
import { ConfirmActions } from "./actions";

const initialState = {
  isOpen: false,
  titleKey: "Confirm",
  cancelButtonTextKey: "Cancel",
  confirmButtonTextKey: "Confirm",
};

const actionHandlers = {
  [ConfirmActions.CONFIRM_SHOW]: ({ state, action }) => ({
    ...state,
    ...action.payload,
    isOpen: true,
  }),
  [ConfirmActions.CONFIRM_HIDE]: () => ({
    ...initialState,
  }),
};

export const ConfirmReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
