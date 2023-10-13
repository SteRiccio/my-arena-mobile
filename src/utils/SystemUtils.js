import SystemNavigationBar from "react-native-system-navigation-bar";
import Clipboard from "@react-native-clipboard/clipboard";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

const setFullScreen = async (fullScreen) => {
  try {
    if (fullScreen) {
      await SystemNavigationBar.stickyImmersive();
    } else {
      await SystemNavigationBar.navigationShow();
    }
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
  setFullScreen,
  setKeepScreenAwake,
  copyValueToClipboard,
};
