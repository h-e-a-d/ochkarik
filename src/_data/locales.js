// Locale registry. Add a new language by importing its JSON and registering it here.
// `hreflang` uses BCP-47 codes; Tajik is `tg` in BCP-47 but `tj` in our URL structure.

const ru = require("./locales/ru.json");
const tj = require("./locales/tj.json");
const en = require("./locales/en.json");

module.exports = {
  ru: { code: "ru", htmlLang: "ru", hreflang: "ru", ogLocale: "ru_RU", name: "Русский",  strings: ru },
  tj: { code: "tj", htmlLang: "tg", hreflang: "tg", ogLocale: "tg_TJ", name: "Тоҷикӣ",   strings: tj },
  en: { code: "en", htmlLang: "en", hreflang: "en", ogLocale: "en_US", name: "English",  strings: en },
};
