import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./en";

const resources = {
  en,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3", // to make it work for Android devices
    resources,
    lng: "en", // default language to use.
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n, useTranslation };
