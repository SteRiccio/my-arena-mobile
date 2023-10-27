import * as Location from "expo-location";

import { SettingsService } from "service";
import { ToastActions } from "..";

const SETTINGS_SET = "SETTINGS_SET";

const setSettings = (settings) => (dispatch) => {
  dispatch({ type: SETTINGS_SET, settings });
};

const initSettings = () => async (dispatch) => {
  const settings = await SettingsService.fetchSettings();
  dispatch(setSettings(settings));
};

const updateSetting =
  ({ key, value }) =>
  async (dispatch) => {
    let canPersist = true;

    if (key === "locationGpsLocked") {
      if (value) {
        canPersist = await dispatch(startGpsLocking());
      } else {
        _stopGpsLocking();
      }
    }
    if (canPersist) {
      const settingsUpdated = await SettingsService.updateSetting({
        key,
        value,
      });
      dispatch(setSettings(settingsUpdated));
    }
  };

const updateSettings = (settings) => async (dispatch) => {
  await SettingsService.saveSettings(settings);
  dispatch(setSettings(settings));
};

let gpsLockingSubscription = null;

const _startGpsLocking = async () => {
  const foregroundPermission =
    await Location.requestForegroundPermissionsAsync();

  const providerStatus = await Location.getProviderStatusAsync();
  if (
    !providerStatus.locationServicesEnabled ||
    !foregroundPermission.granted
  ) {
    return false;
  }
  gpsLockingSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 0,
      timeInterval: 10,
    },
    (_location) => {}
  );
  return true;
};

const startGpsLocking = () => async (dispatch) => {
  const started = await _startGpsLocking();
  if (!started) {
    dispatch(
      ToastActions.show({ textKey: "settings:locationGpsLocked.error" })
    );
  }
  return started;
};

const _stopGpsLocking = () => {
  gpsLockingSubscription?.remove();
};

const stopGpsLocking = () => (_dispatch) => {
  return _stopGpsLocking();
};

export const SettingsActions = {
  SETTINGS_SET,

  initSettings,
  updateSetting,
  updateSettings,

  startGpsLocking,
  stopGpsLocking,
};
