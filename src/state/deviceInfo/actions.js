import * as Battery from "expo-battery";
import * as Device from "expo-device";
import { BatteryState } from "model/BatteryState";

const DEVICE_INFO_SET = "DEVICE_INFO_SET";
const DEVICE_POWER_STATE_SET = "DEVICE_POWER_STATE_SET";

const batteryStatusFromExpoBatteryState = {
  [Battery.BatteryState.CHARGING]: BatteryState.charging,
  [Battery.BatteryState.UNPLUGGED]: BatteryState.unplugged,
};

const setDeviceInfo = (deviceInfo) => (dispatch) => {
  dispatch({ type: DEVICE_INFO_SET, deviceInfo });
};

const _getPowerState = async () => {
  const { batteryLevel, batteryState: expoBatteryState } =
    await Battery.getPowerStateAsync();
  return {
    batteryLevel,
    batteryState: batteryStatusFromExpoBatteryState[expoBatteryState],
  };
};

const initDeviceInfo = () => async (dispatch) => {
  const deviceType =
    (await Device.getDeviceTypeAsync()) || Device.DeviceType.PHONE;
  const { batteryLevel, batteryState } = await _getPowerState();
  dispatch(
    setDeviceInfo({
      deviceType,
      batteryLevel,
      batteryState,
      batteryLevelMeasureStartTime: Date.now(),
    })
  );
};

const updatePowerState = () => async (dispatch, getState) => {
  const {
    batteryLevel: batteryLevelPrev,
    batteryState: batteryStatePrev,
    batteryLevelMeasureStartTime,
  } = getState();
  const { batteryLevel, batteryState } = await _getPowerState();

  const stateChanged = batteryState !== batteryStatePrev;
  if (batteryLevel !== batteryLevelPrev || stateChanged) {
    const action = {
      type: DEVICE_POWER_STATE_SET,
      batteryLevel,
      batteryState,
      batteryTimeToDischarge: null,
      batteryTimeToFullCharge: null,
    };
    if (
      stateChanged ||
      ![BatteryState.unplugged, BatteryState.charging].includes(batteryState)
    ) {
      Object.assign(action, {
        batteryLevelMeasureStartTime: Date.now(),
      });
    } else {
      const elapsedTime = Date.now() - batteryLevelMeasureStartTime;
      const chargeDiff = batteryLevel - batteryLevelPrev;
      const chargeTimeDiff = Math.ceil(
        elapsedTime * (batteryLevel / chargeDiff)
      );
      if (batteryState === BatteryState.unplugged) {
        action.batteryTimeToDischarge = -chargeTimeDiff;
      } else if (batteryState === BatteryState.charging) {
        action.batteryTimeToFullCharge = chargeTimeDiff;
      }
    }
    dispatch(action);
  }
};

export const DeviceInfoActions = {
  DEVICE_INFO_SET,
  DEVICE_POWER_STATE_SET,

  setDeviceInfo,
  initDeviceInfo,
  updatePowerState,
};
