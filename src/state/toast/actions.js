const TOAST_DISMISSED = "TOAST_DISMISSED";
const TOAST_SET = "TOAST_SET";

const dismiss = () => (dispatch) => {
  dispatch({ type: TOAST_DISMISSED });
};

const show =
  ({ textKey, textParams }) =>
  (dispatch) => {
    dispatch({ type: TOAST_SET, textKey, textParams });
  };

export const ToastActions = {
  TOAST_DISMISSED,
  TOAST_SET,

  dismiss,
  show,
};
