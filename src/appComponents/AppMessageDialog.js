import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MessageDialog } from "../components";
import { MessageActions } from "../state/message/actions";

export const AppMessageDialog = () => {
  const dispatch = useDispatch();
  const {
    content,
    contentParams,
    details,
    detailsParams,
    onDismiss: onDismissProp,
    title,
  } = useSelector((state) => state.message);

  const onDismiss = useCallback(() => {
    onDismissProp?.();
    dispatch(MessageActions.dismissMessage());
  }, [onDismissProp]);

  if (!content) return null;

  return (
    <MessageDialog
      content={content}
      contentParams={contentParams}
      details={details}
      detailsParams={detailsParams}
      onDismiss={onDismiss}
      onDone={onDismiss}
      title={title}
    />
  );
};
