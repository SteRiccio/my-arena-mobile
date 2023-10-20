import * as Location from "expo-location";

import { SettingsService } from "service";

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
    const settingsUpdated = await SettingsService.updateSetting({ key, value });
    dispatch(setSettings(settingsUpdated));

    if (key === "locationGpsLocked") {
      dispatch(value ? startGpsLocking() : stopGpsLocking());
    }
  };

const updateSettings = (settings) => async (dispatch) => {
  await SettingsService.saveSettings(settings);
  dispatch(setSettings(settings));
};

let gpsLockingSubscription = null;

const startGpsLocking = () => async (_dispatch) => {
  const foregroundPermission =
    await Location.requestForegroundPermissionsAsync();
  if (!foregroundPermission.granted) {
    return;
  }
  gpsLockingSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 0,
      timeInterval: 10,
    },
    (_location) => {}
  );
};

const stopGpsLocking = () => async (_dispatch) => {
  gpsLockingSubscription?.remove();
};

export const SettingsActions = {
  SETTINGS_SET,

  initSettings,
  updateSetting,
  updateSettings,

  startGpsLocking,
  stopGpsLocking,
};
