/** @format */
/**
 * i18next initialization with bundled ar/en resources and device language detection.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import ar from "./langs/ar.json";
import en from "./langs/en.json";
const locales = getLocales();
const firstLocale = locales.length > 0 ? locales[0] : undefined;
const deviceLanguage = firstLocale ? firstLocale.languageCode : "ar";
const lng = deviceLanguage === "en" ? "en" : "ar";
void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng,
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
});
export default i18n;
