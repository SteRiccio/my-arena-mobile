import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { JobMonitorActions } from "./actions";

export const useJobMonitor = () => {
  const dispatch = useDispatch();

  const jobMonitorState = useSelector((state) => state.jobMonitor);

  const cancel = useCallback(() => {
    dispatch(JobMonitorActions.cancel());
  }, []);

  const close = useCallback(() => {
    dispatch(JobMonitorActions.close());
  }, []);

  return {
    ...jobMonitorState,
    cancel,
    close,
  };
};
