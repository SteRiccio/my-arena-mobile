import { useSelector } from "react-redux";
import { useColorScheme } from "react-native";

import { Themes, ThemesSettings } from "model";
import { SettingsSelectors } from "state";

export const useEffectiveTheme = () => {
  const colorScheme = useColorScheme();

  const themeSetting = useSelector((state) => {
    const settings = SettingsSelectors.selectSettings(state);
    return settings.theme;
  });
  if (themeSetting === ThemesSettings.systemDefault) {
    return colorScheme === "dark" ? Themes.dark : Themes.light;
  }
  return themeSetting;
};
