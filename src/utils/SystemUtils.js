import SystemNavigationBar from "react-native-system-navigation-bar";
import Clipboard from "@react-native-clipboard/clipboard";

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
  copyValueToClipboard,
};
