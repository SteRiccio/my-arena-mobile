import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ConfirmActions } from "./actions";

export const useConfirmDialog = () => {
  const dispatch = useDispatch();

  const confirmState = useSelector((state) => state.confirm);

  const confirm = useCallback(() => {
    dispatch(ConfirmActions.confirm());
  }, [dispatch]);

  const cancel = useCallback(() => {
    dispatch(ConfirmActions.cancel());
  }, [dispatch]);

  return {
    ...confirmState,
    confirm,
    cancel,
  };
};
