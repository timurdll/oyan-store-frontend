import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// Предварительно загрузим ресурсы для всех поддерживаемых языков
import translationRU from "./locales/ru/translation.json";
import translationKK from "./locales/kk/translation.json";

const resources = {
  ru: {
    translation: translationRU,
  },
  kk: {
    translation: translationKK,
  },
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["ru", "kk"],
    fallbackLng: "ru",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    // Отключаем загрузку с сервера, т.к. теперь у нас ресурсы импортированы напрямую
    // backend: {
    //   loadPath: "/locales/{{lng}}/{{ns}}.json",
    // },
    detection: {
      order: [
        "path",
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
      ],
      lookupFromPathIndex: 0,
      caches: ["cookie"],
    },
    react: {
      useSuspense: false, // Отключаем suspense для i18next
    },
  });

export default i18n;
