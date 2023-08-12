import { ThemesSettings } from "model";

const propertyType = {
  boolean: "boolean",
  numeric: "numeric",
  options: "options",
  slider: "slider",
};

const properties = {
  theme: {
    type: propertyType.options,
    labelKey: "settings:theme.label",
    options: Object.values(ThemesSettings).map((theme) => ({
      value: theme,
      label: `settings:theme.${theme}`,
    })),
  },
  fullScreen: {
    type: propertyType.boolean,
    labelKey: "settings:fullScreen",
  },
  animationsEnabled: {
    type: propertyType.boolean,
    labelKey: "settings:animationsEnabled",
  },
  locationAccuracyThreshold: {
    type: propertyType.numeric,
    labelKey: "settings:locationAccuracyThreshold",
  },
  locationAccuracyWatchTimeout: {
    type: propertyType.slider,
    labelKey: "settings:locationAccuracyWatchTimeout",
    minValue: 30,
    maxValue: 300,
    step: 30,
  },
};

export const SettingsModel = {
  propertyType,
  properties,
};
