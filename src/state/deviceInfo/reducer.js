import { StoreUtils } from "../storeUtils";
import { DeviceInfoActions } from "./actions";

const initialState = {};

const actionHandlers = {
  [DeviceInfoActions.DEVICE_INFO_SET]: ({ state, action }) => ({
    ...state,
    ...action.deviceInfo,
  }),
  [DeviceInfoActions.DEVICE_POWER_STATE_SET]: ({ state, action }) => ({
    ...state,
    batteryLevel: action.batteryLevel,
    batteryState: action.batteryState,
  }),
};

export const DeviceInfoReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
