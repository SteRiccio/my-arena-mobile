import { WebSocketService } from "service";

const JOB_MONITOR_START = "JOB_MONITOR_START";
const JOB_MONITOR_UPDATE = "JOB_MONITOR_UPDATE";
const JOB_MONITOR_END = "JOB_MONITOR_END";

const getJobMonitorState = state => state.jobMonitor;

const start =
  ({
    jobUuid,
    titleKey = "common:processing",
    cancelButtonTextKey = "common:cancel",
    closeButtonTextKey = "common:close",
    messageKey,
    messageParams = {},
    onJobComplete = undefined,
    onCancel = undefined,
    onClose = undefined,
  }) =>
  async (dispatch) => {
    dispatch({
      type: JOB_MONITOR_START,
      payload: {
        jobUuid,
        titleKey,
        cancelButtonTextKey,
        closeButtonTextKey,
        messageKey,
        messageParams,
        onJobComplete,
        onCancel,
        onClose,
      },
    });

    const ws = await WebSocketService.open()

    ws.on(WebSocketService.EVENTS.jobUpdate, job => {
      // if (jobUuid === job?.uuid) {
        const {progressPercent, status} = job
        dispatch({type: JOB_MONITOR_UPDATE, payload: {
          progressPercent, 
          status
        }})
      // }
    })
  };

const cancel = () => (dispatch, getState) => {
  const state = getState();
  const jobMonitorState = getJobMonitorState(state)
  const { onCancel } = jobMonitorState;
  onCancel?.();
  dispatch(close())
};

const close = () => (dispatch, getState) => {
  const state = getState();
  const jobMonitorState = getJobMonitorState(state)
  const { onClose } = jobMonitorState;
  onClose?.();
  dispatch({ type: JOB_MONITOR_END });
};

export const JobMonitorActions = {
  JOB_MONITOR_START,
  JOB_MONITOR_UPDATE,
  JOB_MONITOR_END,

  start,
  cancel,
  close,
};
