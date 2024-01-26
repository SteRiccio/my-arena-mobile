import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Application from "expo-application";

import { Dates } from "@openforis/arena-core";

import { Environments } from "./Environments";

let SystemNavigationBar;
let Clipboard;

if (!Environments.isExpoGo) {
  SystemNavigationBar = require("react-native-system-navigation-bar");
  Clipboard = require("@react-native-clipboard/clipboard");
}

const getApplicationInfo = async () => {
  const lastUpdateTime = await Application.getLastUpdateTimeAsync();
  return {
    buildNumber: Application.nativeBuildVersion,
    version: Application.nativeApplicationVersion,
    lastUpdateTime: Dates.formatForStorage(lastUpdateTime),
  };
};

const getRecordAppInfo = async () => {
  const { version } = await getApplicationInfo();
  return {
    appId: "mam",
    appVersion: version,
  };
};

const setFullScreen = async (fullScreen) => {
  try {
    await SystemNavigationBar?.stickyImmersive(fullScreen);
  } catch (e) {
    // ignore it (not available)
  }
};

const setKeepScreenAwake = async (keepScreenAwake) => {
  if (keepScreenAwake) {
    await activateKeepAwakeAsync();
  } else {
    deactivateKeepAwake();
  }
};

const copyValueToClipboard = (value) => {
  try {
    Clipboard?.setString(value);
    return true;
  } catch (_error) {
    // ignore it
    return false;
  }
};

export const SystemUtils = {
  getApplicationInfo,
  getRecordAppInfo,
  setFullScreen,
  setKeepScreenAwake,
  copyValueToClipboard,
};
