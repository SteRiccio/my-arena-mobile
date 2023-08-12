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
  };

const updateSettings = (settings) => async (dispatch) => {
  await SettingsService.saveSettings(settings);
  dispatch(setSettings(settings));
};

export const SettingsActions = {
  SETTINGS_SET,

  initSettings,
  updateSetting,
  updateSettings,
};
