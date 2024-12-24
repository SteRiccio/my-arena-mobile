import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import { LanguageConstants } from "model/LanguageSettings";
import { SettingsService } from "service/settingsService";
import { SystemUtils } from "utils/SystemUtils";

// import am from "./am";
import en from "./en";
// import es from "./es";
// import fr from "./fr";
import pt from "./pt";
// import ru from "./ru";

// const resources = { am, en, es, fr, pt, ru };
const resources = { en, pt };
const supportedLanguageCodes = Object.keys(resources);
const fallbackLng = "en";
const sysLng = SystemUtils.getLanguageCode();

const toSupportedLanguage = (lang) =>
  supportedLanguageCodes.includes(lang) ? lang : fallbackLng;

const systemLanguageOrDefault = toSupportedLanguage(sysLng);

const toTargetLanguage = (lang) =>
  lang === LanguageConstants.system
    ? systemLanguageOrDefault
    : toSupportedLanguage(lang);

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (callback) => {
    SettingsService.fetchSettings()
      .then((settings) => {
        const { language: langInSettings } = settings;
        const targetLanguage = toTargetLanguage(langInSettings);
        callback(targetLanguage);
      })
      .catch(() => {
        callback(systemLanguageOrDefault);
      });
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3", // to make it work for Android devices
    resources,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

const changeLanguage = (lang) => {
  const targetLanguage = toTargetLanguage(lang);
  i18n.changeLanguage(targetLanguage);
};

export { changeLanguage, i18n, useTranslation };
