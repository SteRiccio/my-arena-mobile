import Toast from "react-native-toast-message";

import { i18n } from "localization";

const show = (text) => {
  try {
    Toast.show({
      type: "success",
      text1: i18n.t(text),
    });
  } catch (_error) {
    // ignore it
  }
};

export const Toasts = {
  show,
};
