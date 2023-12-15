import * as Battery from "expo-battery";
import * as Device from "expo-device";

import { BatteryState } from "model";
import { Files } from "utils";

import { DeviceInfoSelectors } from "./selectors";

const DEVICE_INFO_SET = "DEVICE_INFO_SET";
const DEVICE_POWER_STATE_SET = "DEVICE_POWER_STATE_SET";

const batteryStatusFromExpoBatteryState = {
  [Battery.BatteryState.CHARGING]: BatteryState.charging,
  [Battery.BatteryState.FULL]: BatteryState.full,
  [Battery.BatteryState.UNPLUGGED]: BatteryState.unplugged,
};

const setDeviceInfo = (deviceInfo) => (dispatch) => {
  dispatch({ type: DEVICE_INFO_SET, payload: deviceInfo });
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

  const freeDiskStorage = await Files.getFreeDiskStorage();

  dispatch(
    setDeviceInfo({
      batteryLevel,
      batteryState,
      batteryLevelAtStartTime: batteryLevel,
      batteryLevelMeasureStartTime: Date.now(),
      deviceType,
      freeDiskStorage,
    })
  );
};

const updatePowerStateAndFreeDiskStorage = () => async (dispatch, getState) => {
  const state = getState();
  const {
    batteryLevel: batteryLevelPrev,
    batteryState: batteryStatePrev,
    batteryLevelMeasureStartTime,
    batteryLevelAtStartTime,
    freeDiskStorage: freeDiskStoragePrev,
  } = DeviceInfoSelectors.selectDeviceInfo(state);

  const { batteryLevel, batteryState } = await _getPowerState();
  const freeDiskStorage = await Files.getFreeDiskStorage();

  const batteryStateChanged = batteryState !== batteryStatePrev;
  if (
    batteryLevel === batteryLevelPrev &&
    !batteryStateChanged &&
    freeDiskStorage === freeDiskStoragePrev
  ) {
    // do not update state
    return;
  }
  const payload = {};
  if (batteryLevel !== batteryLevelPrev || batteryStateChanged) {
    Object.assign(payload, {
      batteryLevel,
      batteryState,
      batteryTimeToDischarge: null,
      batteryTimeToFullCharge: null,
    });
    if (
      batteryStateChanged ||
      ![BatteryState.unplugged, BatteryState.charging].includes(batteryState)
    ) {
      Object.assign(payload, {
        batteryLevelMeasureStartTime: Date.now(),
        batteryLevelAtStartTime: batteryLevel,
      });
    } else {
      const elapsedTime = Date.now() - batteryLevelMeasureStartTime;
      const chargeDiff = batteryLevel - batteryLevelAtStartTime;
      const batteryLevelToReach =
        batteryState === BatteryState.unplugged
          ? batteryLevel
          : 1 - batteryLevel;
      const chargeTimeDiff = Math.ceil(
        (elapsedTime * batteryLevelToReach) / chargeDiff
      );
      if (batteryState === BatteryState.unplugged) {
        const timeLeft = -chargeTimeDiff;
        if (timeLeft >= 0) {
          payload.batteryTimeToDischarge = timeLeft;
        }
      } else if (batteryState === BatteryState.charging) {
        const timeLeft = chargeTimeDiff;
        if (timeLeft >= 0) {
          payload.batteryTimeToFullCharge = chargeTimeDiff;
        }
      }
    }
  }
  if (freeDiskStorage !== freeDiskStoragePrev) {
    Object.assign(payload, { freeDiskStorage });
  }
  dispatch({ type: DEVICE_POWER_STATE_SET, payload });
};

export const DeviceInfoActions = {
  DEVICE_INFO_SET,
  DEVICE_POWER_STATE_SET,

  setDeviceInfo,
  initDeviceInfo,
  updatePowerStateAndFreeDiskStorage,
};
