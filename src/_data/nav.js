// Canonical nav link list — mirrors services.js's pattern so nav links can't
// silently diverge between the homepage and blog/privacy pages the way they
// had (homepage: 7 links; blog/privacy: 5, missing Reviews and FAQ).
//
// `hash` is the in-page anchor used when the CURRENT page is the homepage
// (src/index.njk, isHome=true). On every other page the nav macro builds
// `/{{ lang }}/` + hash instead, because those anchor ids only exist on the
// homepage. `key: 'home'` and `key: 'blog'` are special-cased by the macro
// (home has no hash off-homepage; blog is always its own page).
//
// `stringKey` looks up `t.nav[stringKey]` in the locale JSON — all three
// locale files already carry all 7 keys (nav.home/services/about/reviews/
// faq/contact/blog), even though only the homepage used to render all 7.
module.exports = [
  { key: "home", hash: "#home", stringKey: "home" },
  { key: "services", hash: "#services", stringKey: "services" },
  { key: "about", hash: "#about", stringKey: "about" },
  { key: "testimonials", hash: "#testimonials", stringKey: "reviews" },
  { key: "faq", hash: "#faq", stringKey: "faq" },
  { key: "contact", hash: "#contact", stringKey: "contact" },
  { key: "blog", hash: null, stringKey: "blog" },
];
