import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ConfirmActions } from "./actions";

const defaultLocalState = {
  selectedSingleChoiceValue: null,
};

export const useConfirmDialog = () => {
  const dispatch = useDispatch();

  const confirmState = useSelector((state) => state.confirm);
  const [state, setState] = useState(defaultLocalState);

  const { selectedSingleChoiceValue } = state;

  useEffect(() => {
    setState(defaultLocalState);
  }, [confirmState]);

  const confirm = useCallback(() => {
    dispatch(ConfirmActions.confirm({ selectedSingleChoiceValue }));
  }, [dispatch, selectedSingleChoiceValue]);

  const cancel = useCallback(() => {
    dispatch(ConfirmActions.cancel());
  }, [dispatch]);

  const onSingleChoiceOptionChange = useCallback((value) => {
    setState((statePrev) => ({
      ...statePrev,
      selectedSingleChoiceValue: value,
    }));
  }, []);

  return {
    ...confirmState,
    confirm,
    cancel,

    onSingleChoiceOptionChange,
    selectedSingleChoiceValue,
  };
};
