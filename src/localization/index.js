import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { SystemUtils } from "utils/SystemUtils";

import en from "./en";

const resources = { en };
const supportedLanguageCodes = Object.keys(resources);
const fallbackLng = supportedLanguageCodes[0];
const sysLng = SystemUtils.getLanguageCode();
const lng = supportedLanguageCodes.includes(sysLng) ? sysLng : fallbackLng;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3", // to make it work for Android devices
    resources,
    lng,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n, useTranslation };
