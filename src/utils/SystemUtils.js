import SystemNavigationBar from "react-native-system-navigation-bar";
import Clipboard from "@react-native-clipboard/clipboard";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Application from "expo-application";

import { Dates } from "@openforis/arena-core";

const getApplicationInfo = async () => {
  const lastUpdateTime = await Application.getLastUpdateTimeAsync();
  return {
    buildNumber: Application.nativeBuildVersion,
    version: Application.nativeApplicationVersion,
    lastUpdateTime: Dates.formatForStorage(lastUpdateTime),
  };
};

const setFullScreen = async (fullScreen) => {
  try {
    await SystemNavigationBar.stickyImmersive(fullScreen);
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
    Clipboard.setString(value);
    return true;
  } catch (_error) {
    // ignore it
    return false;
  }
};

export const SystemUtils = {
  getApplicationInfo,
  setFullScreen,
  setKeepScreenAwake,
  copyValueToClipboard,
};
