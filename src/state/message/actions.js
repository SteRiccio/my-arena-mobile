const MESSAGE_DISMISSED = "MESSAGE_DISMISSED";
const MESSAGE_SET = "MESSAGE_SET";

const dismissMessage = () => (dispatch) => {
  dispatch({ type: MESSAGE_DISMISSED });
};

const setMessage =
  ({ content }) =>
  (dispatch) => {
    dispatch({ type: MESSAGE_SET, content });
  };

export const MessageActions = {
  MESSAGE_DISMISSED,
  MESSAGE_SET,

  dismissMessage,
  setMessage,
};
