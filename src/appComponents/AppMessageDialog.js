import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { MessageDialog } from "../components";
import { MessageActions } from "../state/message/actions";

export const AppMessageDialog = () => {
  const dispatch = useDispatch();
  const { content, contentParams } = useSelector((state) => state.message);

  const onDismiss = () => {
    dispatch(MessageActions.dismissMessage());
  };

  if (!content) return null;

  return (
    <MessageDialog
      content={content}
      contentParams={contentParams}
      onDismiss={onDismiss}
      onDone={onDismiss}
    />
  );
};
