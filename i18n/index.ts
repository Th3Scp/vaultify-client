import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import EN from "../locales/en/translation.json";
import FA from "../locales/fa/translation.json";

const resources = {
  en: {
    translation: EN,
  },
  fa: {
    translation: FA,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  ns: "translation",
  defaultNS: "translation",
});

export default i18n;