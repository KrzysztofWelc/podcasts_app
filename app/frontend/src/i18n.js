import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en.json'
import pl from './translations/pl.json'

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'pl',
        resources: {
            en: {
                translation: en
            },
            pl: {
                translation: pl
            },

        }
    })

export default i18next