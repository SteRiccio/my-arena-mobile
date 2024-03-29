import { useSelector } from "react-redux";
import * as Device from "expo-device";

const selectDeviceInfo = (state) => state.deviceInfo;

const selectIsDeviceType = (type) => (state) => {
  const info = selectDeviceInfo(state);
  const { deviceType } = info;
  return deviceType === type;
};

const selectIsPhone = selectIsDeviceType(Device.DeviceType.PHONE);
const selectIsTablet = selectIsDeviceType(Device.DeviceType.TABLET);
const selectBatteryLevel = (state) => selectDeviceInfo(state).batteryLevel;
const selectBatteryState = (state) => selectDeviceInfo(state).batteryState;

export const DeviceInfoSelectors = {
  selectDeviceInfo,

  useDeviceInfo: () => useSelector(selectDeviceInfo),
  useIsTablet: () => useSelector(selectIsTablet),
  useIsPhone: () => useSelector(selectIsPhone),
  useBatteryLevel: () => useSelector(selectBatteryLevel),
  useBatteryState: () => useSelector(selectBatteryState),
};
