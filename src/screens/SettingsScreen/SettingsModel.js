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
  keepScreenAwake: {
    type: propertyType.boolean,
    labelKey: "settings:keepScreenAwake",
  },
  animationsEnabled: {
    type: propertyType.boolean,
    labelKey: "settings:animationsEnabled",
  },
  fontScale: {
    type: propertyType.slider,
    labelKey: "settings:fontScale",
    minValue: 0.7,
    maxValue: 1.6,
    step: 0.3,
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
  locationGpsLocked: {
    type: propertyType.boolean,
    labelKey: "settings:locationGpsLocked.label",
    descriptionKey: "settings:locationGpsLocked.description",
  },
};

export const SettingsModel = {
  propertyType,
  properties,
};
