import React, { useEffect } from "react";

import { MessageActions } from "state/message";
import { useDispatch } from "react-redux";

export const ErrorFallbackComponent = (props) => {
  const { error, resetError } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      MessageActions.setMessage({
        content: "common:somethingWentWrong",
        contentParams: { error: error.toString() },
        details: error.stack,
        onDismiss: resetError,
        title: "common:error",
      })
    );
  }, [error]);

  return null;
};
