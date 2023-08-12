import SystemNavigationBar from "react-native-system-navigation-bar";

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

export const SystemUtils = {
  setFullScreen,
};
