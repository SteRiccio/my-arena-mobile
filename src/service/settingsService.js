import * as Keychain from "react-native-keychain";

import { AsyncStorageUtils } from "./asyncStorage/AsyncStorageUtils";
import { asyncStorageKeys } from "./asyncStorage/asyncStorageKeys";

const defaultServerUrl = "https://openforis-arena.org";

const defaultSettings = {
  serverUrlType: "default",
  serverUrl: defaultServerUrl,
  animationsEnabled: true,
  locationAccuracyThreshold: 3,
  locationAccuracyWatchTimeout: 120,
};

let INSTANCE = null;

const fetchSettings = async () => {
  if (!INSTANCE) {
    console.log("====here");
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

export const SettingsService = {
  defaultServerUrl,
  fetchSettings,
  saveSettings,

  getCredentials,
  setCredentials,
};
