const MESSAGE_DISMISSED = "MESSAGE_DISMISSED";
const MESSAGE_SET = "MESSAGE_SET";

const dismissMessage = () => (dispatch) => {
  dispatch({ type: MESSAGE_DISMISSED });
};

const setMessage =
  ({
    content,
    contentParams = null,
    details = null,
    detailsParams = null,
    onDismiss = null,
    title = "common:info",
  }) =>
  (dispatch) => {
    dispatch({
      type: MESSAGE_SET,
      payload: {
        content,
        contentParams,
        details,
        detailsParams,
        onDismiss,
        title,
      },
    });
  };

export const MessageActions = {
  MESSAGE_DISMISSED,
  MESSAGE_SET,

  dismissMessage,
  setMessage,
};
