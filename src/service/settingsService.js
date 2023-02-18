import { AsyncStorageUtils } from "./asyncStorage/AsyncStorageUtils";
import { asyncStorageKeys } from "./asyncStorage/asyncStorageKeys";

const defaultSettings = {
  serverUrlType: "default",
  serverUrl: "https://openforis-arena.org",
};

const getSettings = async () =>
  (await AsyncStorageUtils.getItem(asyncStorageKeys.settings)) ||
  defaultSettings;

const setSettings = async (settings) =>
  AsyncStorageUtils.setItem(asyncStorageKeys.settings, settings);

export const SettingsService = {
  getSettings,
  setSettings,
};
