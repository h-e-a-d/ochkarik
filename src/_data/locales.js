// Locale registry. Add a new language by importing its JSON and registering it here.
// `hreflang` uses BCP-47 codes; Tajik is `tg` in BCP-47 but `tj` in our URL structure.

const site = require("./site");

const ru = require("./locales/ru.json");
const tj = require("./locales/tj.json");
const en = require("./locales/en.json");

// Values that change with the calendar, substituted into every locale string
// exactly once, here — so no template has to remember a `| replace` and no
// human has to edit a number each January.
//
//   {year}  → 2026   footer copyright  (was hardcoded "© 2025" in all locales)
//   {years} → 9      years of experience (was hardcoded "8" in 12 strings,
//                     the stats circle and script.js's counter target)
//
// Both had already gone stale in production. Derive, don't retype.
const PLACEHOLDERS = {
  "{year}": String(site.buildYear),
  "{years}": String(site.yearsExperience),
};

function substitute(value) {
  if (typeof value === "string") {
    let out = value;
    for (const [token, replacement] of Object.entries(PLACEHOLDERS)) {
      out = out.split(token).join(replacement);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map(substitute);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, substitute(v)])
    );
  }
  return value;
}

module.exports = {
  ru: { code: "ru", htmlLang: "ru", hreflang: "ru", ogLocale: "ru_RU", name: "Русский",  strings: substitute(ru) },
  tj: { code: "tj", htmlLang: "tg", hreflang: "tg", ogLocale: "tg_TJ", name: "Тоҷикӣ",   strings: substitute(tj) },
  en: { code: "en", htmlLang: "en", hreflang: "en", ogLocale: "en_US", name: "English",  strings: substitute(en) },
};
