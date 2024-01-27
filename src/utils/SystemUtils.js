import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Application from "expo-application";

import { Dates } from "@openforis/arena-core";

import { Environment } from "./Environment";

const { nativeBuildVersion: buildNumber, nativeApplicationVersion: version } =
  Application;

const appId = "mam";

let SystemNavigationBar;
let Clipboard;

if (!Environment.isExpoGo) {
  SystemNavigationBar = require("react-native-system-navigation-bar");
  Clipboard = require("@react-native-clipboard/clipboard");
}

const getLastUpdateTime = async () =>
  Environment.isAndroid ? Application.getLastUpdateTimeAsync() : null;

const getApplicationInfo = async () => {
  const lastUpdateTime = await getLastUpdateTime();
  return {
    buildNumber,
    version,
    lastUpdateTime: Dates.formatForStorage(lastUpdateTime),
  };
};

const getRecordAppInfo = () => ({
  appId,
  appVersion: version,
});

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
