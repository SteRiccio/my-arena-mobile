import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Application from "expo-application";
import { Dates } from "@openforis/arena-core";

import { Environment } from "./Environment";

const { nativeBuildVersion: buildNumber, nativeApplicationVersion: version } =
  Application;

const appId = "mam";
const { isAndroid, isExpoGo, platform } = Environment;

let SystemNavigationBar;
if (!isExpoGo && isAndroid) {
  SystemNavigationBar = require("react-native-system-navigation-bar")?.default;
}

let Clipboard;
if (!isExpoGo) {
  Clipboard = require("@react-native-clipboard/clipboard")?.default;
}

const getLastUpdateTime = async () =>
  isAndroid ? Application.getLastUpdateTimeAsync() : null;

const getApplicationInfo = async () => {
  const lastUpdateTime = await getLastUpdateTime();
  return {
    buildNumber,
    version,
    lastUpdateTime: lastUpdateTime
      ? Dates.formatForStorage(lastUpdateTime)
      : null,
  };
};

const getRecordAppInfo = () => ({
  appId,
  version,
  platform,
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
