const CONFIRM_SHOW = "CONFIRM_SHOW";
const CONFIRM_HIDE = "CONFIRM_HIDE";

const show =
  ({
    titleKey = "common:confirm",
    cancelButtonTextKey = "common:cancel",
    confirmButtonTextKey = "common:confirm",
    messageKey,
    messageParams = {},
    onConfirm,
    onCancel = undefined,
  }) =>
  (dispatch) => {
    dispatch({
      type: CONFIRM_SHOW,
      payload: {
        titleKey,
        cancelButtonTextKey,
        confirmButtonTextKey,
        messageKey,
        messageParams,
        onConfirm,
        onCancel,
      },
    });
  };

const confirm = () => (dispatch, getState) => {
  const state = getState();
  const { onConfirm } = state.confirm;
  onConfirm();
  dispatch({ type: CONFIRM_HIDE });
};

const cancel = () => (dispatch, getState) => {
  const state = getState();
  const { onCancel } = state.confirm;
  onCancel?.();
  dispatch({ type: CONFIRM_HIDE });
};

export const ConfirmActions = {
  CONFIRM_SHOW,
  CONFIRM_HIDE,

  show,
  confirm,
  cancel,
};
