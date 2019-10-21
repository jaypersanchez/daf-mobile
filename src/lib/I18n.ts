import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import resources from '../locale'

const options = {
  fallbackLng: 'en',
  debug: false,
  resources,
  interpolation: {
    escapeValue: false,
  },
}

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb: any) => {
    const locales = RNLocalize.getLocales()
    cb(locales[0].languageCode)
  },
  init: () => {
    // Code
  },
  cacheUserLanguage: () => {
    // Code
  },
}

i18n
  // @ts-ignore
  .use(languageDetector)
  .use(initReactI18next)
  .init(options)

export default i18n
