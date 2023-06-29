import * as Keychain from "react-native-keychain";

import { AsyncStorageUtils } from "./asyncStorage/AsyncStorageUtils";
import { asyncStorageKeys } from "./asyncStorage/asyncStorageKeys";
import { API } from "./api";
import { ThemesSettings } from "model";

const defaultServerUrl = "https://www.openforis-arena.org";

const defaultSettings = {
  animationsEnabled: true,
  locationAccuracyThreshold: 3,
  locationAccuracyWatchTimeout: 120,
  serverUrlType: "default",
  serverUrl: defaultServerUrl,
  theme: ThemesSettings.auto,
};

let INSTANCE = null;

const fetchSettings = async () => {
  if (!INSTANCE) {
    INSTANCE = {
      ...defaultSettings,
      ...(await AsyncStorageUtils.getItem(asyncStorageKeys.settings)),
    };
  }
  return INSTANCE;
};

const saveSettings = async (settings) => {
  await AsyncStorageUtils.setItem(asyncStorageKeys.settings, settings);
  INSTANCE = settings;
};

const getCredentials = async (server) =>
  Keychain.getInternetCredentials(server);

const setCredentials = async (server, email, password) =>
  Keychain.setInternetCredentials(server, email, password);

const testServerUrl = async (serverUrl) => {
  try {
    await API.get(serverUrl, "guest/");
    return true;
  } catch (error) {
    return false;
  }
};

export const SettingsService = {
  defaultServerUrl,
  fetchSettings,
  saveSettings,

  getCredentials,
  setCredentials,

  testServerUrl,
};
