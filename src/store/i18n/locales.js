const br_lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage || 'en').substring(0,2)

export const defaultLocale =  br_lang === 'ja' ? 'jp': br_lang 

export const locales = [
  {
    code: 'en',
    name: 'English',
    dir: 'ltr'
  },
  {
    code: 'ru',
    name: 'Русский',
    dir: 'ltr'
  },
  {
    code: 'jp',
    name: 'Japan',
    dir: 'ltr'
  }
]
