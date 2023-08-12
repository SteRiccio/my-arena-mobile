import { StoreUtils } from "../storeUtils";
import { DeviceInfoActions } from "./actions";

const initialState = {};

const actionHandlers = {
  [DeviceInfoActions.DEVICE_INFO_SET]: ({ state, action }) => ({
    ...state,
    ...action.deviceInfo,
  }),
};

export const DeviceInfoReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
