# Header/footer/head architecture — design

Date: 2026-07-17
Status: approved, ready for planning

## Problem

There is no `src/_includes/` directory despite `.eleventy.js` configuring `includes: "_includes"`. Every template (`src/index.njk`, `src/blog/index.njk`, `src/blog/post.njk`, `src/privacy.njk`) hand-rolls its own `<head>`, nav, and footer from scratch. Consequences observed:

- **Footer**: 4 independent copies. The two blog copies are byte-identical to each other but have drifted from the homepage: dead `href="#"` social links (Facebook/Instagram; LinkedIn missing entirely), no Privacy Policy link (CLAUDE.md's SEO checklist claims one exists sitewide — false on blog/privacy pages), services column cut from 5 links to 3, missing `aria-label`/`aria-hidden` on social icons, `<h3>` vs `<h4>` heading level.
- **Footer service labels** duplicate `services.js` titles under a separate `footer.*` locale key namespace (15 strings across 3 locales) and have already drifted in wording from the canonical titles (`footer.eyeExams` says "Examinations", canonical says "Examination"; `footer.contacts` drops "& Treatment"). This is the same drift class `services.js` was created to eliminate for the visible cards + schema — the footer escaped that refactor.
- **Nav**: 4 independent copies. Homepage lists 7 links, blog/privacy list 5 (no Reviews, no FAQ). Homepage's language badge is hardcoded `EN` in markup (`src/index.njk:310`), corrected only after `script.js` runs — a visible flash of the wrong language on `/ru/`, the primary locale. Blog computes it correctly server-side (`{{ lang | upper }}`).
- **`<head>`**: duplicated 4x, and this is the direct root cause of the version-sync ritual CLAUDE.md marks CRITICAL — `?v=` query strings for CSS/Tailwind/JS live as constants in `sw.js` and are re-typed by hand into every template, cross-checked before each deploy with `grep -rhoE '\?v=[0-9.]+' src/ sw.js | sort | uniq -c`.

## Decisions (confirmed with user)

1. **Scope**: full base layout — `<head>`, nav, and footer all extracted, plus the `?v=` versioning root-caused via a shared data file. Not a footer-only or footer+header-only change.
2. **Link sets**: nav and footer become identical across all pages (7 nav links, 5 footer services, full info column including Privacy, all 3 social links). Only the anchor target differs by page (`#services` on the homepage, `/{{ lang }}/#services` elsewhere) and the nav's transparent-vs-solid background variant (homepage has a hero underneath; other pages don't — this difference is real and preserved).
3. **Mechanism**: Nunjucks `{% extends %}` + `{% block %}` for the skeleton, macros (`import ... with context`) for nav/footer. Verified against the project's installed Nunjucks that a child template's top-level `{% set t = locales[lang].strings %}` is visible both inside blocks it fills and inside macros the base layout imports — so child templates need no import boilerplate.
4. **Versioning**: `sw.js` becomes `src/sw.njk` (Eleventy template, `permalink: /sw.js`), and both it and the head partial read version numbers from one new data file, `src/_data/assets.js`. This makes the `?v=` mismatch class of bug structurally impossible and removes the need for the pre-deploy grep cross-check.

## File structure

```
src/_includes/
  layouts/
    base.njk          doctype, <head>, nav, footer, script tags — skeleton with blocks
  partials/
    head-common.njk   charset, viewport, canonical, hreflang, OG tags, versioned CSS links, GTM
    nav.njk           {% macro render(lang, variant, active) %}
    footer.njk        {% macro render(lang, isHome) %}
src/_data/
  assets.js    NEW    single source for every ?v= version (cache, css, tailwind, script, visionTest, visionDisorders)
  nav.js       NEW    nav link registry (key, anchor fragment, locale string key) — mirrors services.js's pattern
  services.js  EDIT   add `footer: true` to the 5 entries the footer links to
  site.js      EDIT   add social URLs (Facebook/Instagram/LinkedIn — currently hardcoded only in index.njk)
src/sw.njk     NEW    replaces sw.js; reads assets.js; permalink /sw.js
```

`sw.js` (root) is deleted once `src/sw.njk` produces byte-identical output at the same path.

## Data flow

Every template already does `{% set t = locales[lang].strings %}` (or `item.lang` for `post.njk`, aliased to `lang`) before its content. That assignment is visible inside `{% block %}` regions the child fills, and inside macros `base.njk` imports `with context` — confirmed by a standalone Nunjucks test against the repo's installed version, not assumed. So a migrated page is just:

```njk
---
pagination: { data: locales, size: 1, alias: lang }
permalink: "/{{ lang }}/privacy/index.html"
---
{%- set t = locales[lang].strings -%}
{% extends "layouts/base.njk" %}
{% block content %}
  ...page content only...
{% endblock %}
```

`base.njk` itself imports the nav/footer macros and calls them, passing `lang` plus a per-page variant/isHome flag set via a `{% set %}` before `{% extends %}` (or an `eleventyComputed` value) — the child never needs to import anything.

The footer's services column iterates `services.js` entries where `footer: true`, reading `services.<key>.title` from locale strings — eliminating the 15 separate `footer.*` service keys and folding the footer into the same one-source-of-truth pattern `services.js` already established for cards and schema.

## Bugs fixed as a structural consequence

- Dead `href="#"` social links on blog/privacy → real URLs from `site.js`, everywhere.
- Missing LinkedIn on blog/privacy.
- Missing Privacy Policy link on blog/privacy footers.
- Homepage nav's hardcoded `EN` flash on `/ru/` → server-rendered `{{ lang | upper }}` like the blog already does.
- Missing `aria-label`/`aria-hidden` on blog/privacy footer social icons.
- Footer service label drift from canonical `services.js` titles.
- `?v=` version mismatch risk, and the manual grep ritual required to catch it.

## Migration order

1. Add `assets.js`, `nav.js`; extend `site.js`, `services.js`. Nothing consumes them yet — `npm run build` output is unaffected. Verify via clean/no-op diff of `_site/`.
2. Convert `sw.js` → `src/sw.njk` reading `assets.js`. Build and diff `_site/sw.js` against the prior hand-written file — must be byte-identical except for now being generated.
3. Build `partials/head-common.njk`, `partials/nav.njk`, `partials/footer.njk`, `layouts/base.njk` off to the side, not yet wired into any page.
4. Migrate templates one at a time, easiest first: `privacy.njk` → `blog/post.njk` → `blog/index.njk` → `index.njk` (most head content to relocate into blocks — JSON-LD schemas, hero preloads, inlined Tailwind). After each: `npm run build`, diff old vs. new rendered HTML per locale, confirm only the intended link/bug changes appear.
5. Delete the old per-template head/nav/footer markup once all four are migrated and diffed clean.

## Verification plan

- `npm run build` before/after every template migration; diff rendered `_site/` HTML per locale (ru/tj/en) × page type (home/blog index/blog post/privacy).
- Extract every `<script type="application/ld+json">` block post-migration and `JSON.parse` it to confirm structural data still validates.
- `grep -rhoE '\?v=[0-9.]+' _site/ | sort -u` should collapse to exactly one version string per asset (script.js, vision-test.js, vision-disorders.js, styles.css, tailwind.css).
- Manual browser pass: homepage nav transparency-on-scroll, mobile menu toggle, language switcher navigation, glasses animation (historically broken by stale-cache SW issues — highest-risk regression surface), SW update toast on a version bump.
- Cross-check hreflang blocks (ru/tg/en + x-default=/ru/) are still present and identical in shape across all four page types.

## CSP / Netlify check (resolved)

`_headers` is a single blanket `/*` rule with no path-specific entries and no `Service-Worker-Allowed` header (default `/sw.js` scope already covers the origin). Since `src/sw.njk` renders to the same `/sw.js` path with equivalent content, this is confirmed a no-op — no `_headers` change needed.

## CLAUDE.md updates required (part of this work, not follow-up)

- Version Management table: rewrite to describe `assets.js` as the single source, remove the multi-file grep cross-check instruction (structurally unnecessary after this change).
- File Structure listing: `sw.js` → `src/sw.njk`; add the new `_includes/` tree.
- Note that nav/footer link sets are now shared components (`nav.js` / `services.js`-driven footer) — a link or service change is one data-file edit, not four template edits.
- Services section ("one source of truth"): mention the footer now also renders from `services.js`.

## Out of scope

- No visual/CSS redesign — same Tailwind classes, same structure, just deduplicated.
- No change to the vision-test, vision-disorders, or glasses-animation logic.
- No change to blog content workflow or `blog.md`.
