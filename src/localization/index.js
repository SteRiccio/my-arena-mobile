import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { SystemUtils } from "utils/SystemUtils";

import en from "./en";
import es from "./es";
import fr from "./fr";
import pt from "./pt";

const resources = { en, es, fr, pt };
const supportedLanguageCodes = Object.keys(resources);
const fallbackLng = 'en';
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
