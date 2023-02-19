import * as Keychain from "react-native-keychain";

import { AsyncStorageUtils } from "./asyncStorage/AsyncStorageUtils";
import { asyncStorageKeys } from "./asyncStorage/asyncStorageKeys";

const defaultServerUrl = "https://openforis-arena.org";

const defaultSettings = {
  serverUrlType: "default",
  serverUrl: defaultServerUrl,
};

let INSTANCE = null;

const fetchSettings = async () => {
  const settings =
    INSTANCE ||
    (await AsyncStorageUtils.getItem(asyncStorageKeys.settings)) ||
    defaultSettings;
  INSTANCE = settings;
  return settings;
};

const saveSettings = async (settings) => {
  await AsyncStorageUtils.setItem(asyncStorageKeys.settings, settings);
  INSTANCE = settings;
};

const getCredentials = async (server) =>
  Keychain.getInternetCredentials(server);

const setCredentials = async (server, email, password) =>
  Keychain.setInternetCredentials(server, email, password);

export const SettingsService = {
  defaultServerUrl,
  fetchSettings,
  saveSettings,

  getCredentials,
  setCredentials,
};
