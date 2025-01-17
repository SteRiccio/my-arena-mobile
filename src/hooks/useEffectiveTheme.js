import { useMemo } from "react";
import { useColorScheme } from "react-native";

import { Themes, ThemesSettings } from "model";
import { SettingsSelectors } from "../state/settings/selectors";
import { DarkTheme } from "theme/DarkTheme";
import { LightTheme } from "theme/LightTheme";

const defaultFontSize = 16;

const ColorSchemeName = {
  dark: "dark",
  light: "light",
};

const resizeFonts = (fontScale) => (fonts) =>
  Object.entries(fonts).reduce((acc, [fontKey, font]) => {
    const fontResized = {
      ...font,
      fontSize: Math.floor(font.fontSize ?? defaultFontSize * fontScale),
    };
    acc[fontKey] = fontResized;
    return acc;
  }, {});

export const useEffectiveTheme = () => {
  const colorScheme = useColorScheme();

  let { theme: themeSetting = ThemesSettings.auto, fontScale = 1 } =
    SettingsSelectors.useSettings();

  if (themeSetting === ThemesSettings.auto) {
    themeSetting =
      colorScheme === ColorSchemeName.dark ? Themes.dark : Themes.light;
  }
  return useMemo(() => {
    const theme = themeSetting === Themes.dark ? DarkTheme : LightTheme;
    const { fonts } = theme;
    const fontsResized = resizeFonts(fontScale)(fonts);
    return { ...theme, fonts: fontsResized };
  }, [fontScale, themeSetting]);
};
