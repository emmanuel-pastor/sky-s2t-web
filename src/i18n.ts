import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from "i18next";
import english from './locales/en/en.json';
import french from './locales/fr/fr.json';
import {initReactI18next} from "react-i18next";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: import.meta.env.MODE === 'development',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: english
      },
      fr: {
        translation: french
      }
    }
  });

export default i18next;