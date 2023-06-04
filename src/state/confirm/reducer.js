import { StoreUtils } from "../storeUtils";
import { ConfirmActions } from "./actions";

const initialState = {
  isOpen: false,
  titleKey: "common:confirm",
  cancelButtonTextKey: "common:cancel",
  confirmButtonTextKey: "common:confirm",
};

const actionHandlers = {
  [ConfirmActions.CONFIRM_SHOW]: ({ state, action }) => ({
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
