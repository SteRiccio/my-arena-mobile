import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { ToastActions } from "state/toast";

export const useToast = () => {
  const dispatch = useDispatch();

  const show = useCallback((textKey, textParams = {}) => {
    dispatch(ToastActions.show(textKey, textParams));
  }, []);

  return {
    show,
  };
};
