import * as Device from "expo-device";

const DEVICE_INFO_SET = "DEVICE_INFO_SET";

const setDeviceInfo = (deviceInfo) => (dispatch) => {
  dispatch({ type: DEVICE_INFO_SET, deviceInfo });
};

const initDeviceInfo = () => async (dispatch) => {
  const deviceType =
    (await Device.getDeviceTypeAsync()) || Device.DeviceType.PHONE;
  dispatch(setDeviceInfo({ deviceType }));
};

export const DeviceInfoActions = {
  DEVICE_INFO_SET,

  initDeviceInfo,
  setDeviceInfo,
};
