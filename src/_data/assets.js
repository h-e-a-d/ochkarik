// Single source of truth for every `?v=` asset version and for sw.js's
// CACHE_VERSION. Before this file existed, these numbers were re-typed by
// hand into sw.js and every template's <head>, and a pre-deploy grep
// (`grep -rhoE '\?v=[0-9.]+' src/ sw.js | sort | uniq -c`) was the only way
// to catch a mismatch. Edit a version here; every consumer picks it up on
// the next build — the mismatch class of bug is now structurally impossible.
//
// Bump `cache` on ANY change to a cached asset (styles.css, tailwind output,
// any JS file, blog.css, assets/icons.svg) — it purges every visitor's SW
// cache. Bump the specific asset's own version (css/tailwind/blogCss/script/
// visionTest/visionDisorders) only when that asset's bytes actually change.
module.exports = {
  cache: "1.7.3",
  css: "1.7.1",
  tailwind: "1.6.0",
  blogCss: "1.6.0",
  script: "1.2.1",
  visionTest: "1.1.0",
  visionDisorders: "1.1.0",
};
