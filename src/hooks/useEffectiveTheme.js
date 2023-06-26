import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Appearance } from "react-native";

import { Themes, ThemesSettings } from "model";
import { SettingsSelectors } from "state";

export const useEffectiveTheme = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const appearanceChangeSubscription = Appearance.addChangeListener(
      (appearancePreferences) => {
        setColorScheme(appearancePreferences.colorScheme);
      }
    );
    return () => {
      appearanceChangeSubscription.remove();
    };
  });

  return useSelector((state) => {
    const settings = SettingsSelectors.selectSettings(state);

    const { theme: themeSetting } = settings;

    if (themeSetting === ThemesSettings.systemDefault) {
      return colorScheme === "dark" ? Themes.dark : Themes.light;
    }
    return themeSetting;
  });
};
