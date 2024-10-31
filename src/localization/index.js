import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./en";
import { SystemUtils } from "utils/SystemUtils";

const resources = {
  en,
};

const locale = SystemUtils.getLocale();
i18n.locale = locale;

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3", // to make it work for Android devices
    resources,

    lng: SystemUtils.getLanguageCode(), // default language to use.
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n, useTranslation };
