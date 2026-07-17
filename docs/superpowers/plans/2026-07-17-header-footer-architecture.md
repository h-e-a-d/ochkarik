# Header/Footer/Head Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four hand-duplicated copies of `<head>`, nav, and footer (in `src/index.njk`, `src/blog/index.njk`, `src/blog/post.njk`, `src/privacy.njk`) with a shared Eleventy layout (`layouts/base.njk`) plus nav/footer macros, and single-source every `?v=` asset version through a new `src/_data/assets.js` (also used to generate `sw.js`, which becomes `src/sw.njk`).

**Architecture:** Nunjucks `{% extends %}` + `{% block %}` for the page skeleton; macros (`{% import ... with context %}`) for nav and footer, reading `nav.js`/`services.js`/`site.js` as data instead of hardcoded markup. All Nunjucks scoping assumptions below (child `{% set %}` visible inside blocks and inside base-imported macros; macro default params; `array.push()` inside `{% set _ = ... %}`) were verified against this repo's installed Nunjucks via standalone scripts, not assumed.

**Tech Stack:** Eleventy 3, Nunjucks (already the project's template engine — no new dependency).

## Global Constraints

- Canonical phone: `+992 108 11 80 80` / `tel:+992108118080` / `wa.me/992108118080` — untouched by this migration, but any markup this plan transplants must not typo it.
- `x-default` hreflang → `/ru/` everywhere — hreflang blocks are NOT consolidated by this plan (see Task 6 rationale); each page keeps its own, unchanged, and must still emit `x-default=/ru/{suffix}` after migration.
- No `review`/`aggregateRating` JSON-LD — schema blocks are moved verbatim into `{% block schema %}` regions, never regenerated; do not reintroduce.
- No CDN resources — every new/moved asset reference stays self-hosted; `_headers` CSP is unaffected (confirmed: `/*` blanket rule, no path-specific entries, no `Service-Worker-Allowed` header — verified by reading `_headers` during design).
- Inject text into `<script type="application/ld+json">` with `{{ value | dump | safe }}`, never `"{{ value }}"` — all existing JSON-LD blocks already follow this; preserve exactly when relocating.
- `npm run build` must succeed after every task; there is no test suite, so "tests" in this plan are build + rendered-HTML diff + `node -e "JSON.parse(...)"` schema validation, per CLAUDE.md's own verification habit.
- One approved, intentional visual change: **`src/privacy.njk`'s footer grows from a copyright-only line to the full 4-column footer** (services/info/connect columns), matching the user-approved design section "unify nav/footer to the full set on all pages, no privacy carve-out." Every other page's rendered output must be pixel-identical pre/post migration except for the specific bug fixes listed in Task 11.

---

## File Structure

```
src/_data/
  assets.js    NEW   single source for every ?v= version + sw.js CACHE_VERSION
  nav.js       NEW   nav link registry (mirrors services.js's pattern)
  site.js      EDIT  add `social: {facebook, instagram, linkedin}`
  services.js  EDIT  add `footer: true` to the 5 services the footer links to
src/sw.njk     NEW   replaces root sw.js; permalink /sw.js; reads assets.js
sw.js          DELETE (root file, once src/sw.njk output is verified byte-equivalent)
.eleventy.js   EDIT  remove the now-dead `addPassthroughCopy({ "sw.js": "sw.js" })` line
src/_includes/
  layouts/
    base.njk           NEW   skeleton: doctype, head, nav, footer, shared body script
  partials/
    head-common.njk     NEW   charset/viewport/favicon/font-preloads/styles.css link
    gtm-loader.njk       NEW   idle-deferred GTM `<script>` (used via {% include %})
    gtm-noscript.njk     NEW   GTM `<noscript><iframe>` (used via {% include %})
    nav.njk              NEW   {% macro render(lang, variant, isHome, activeKey='', langSwitcherLinks=none) %}
    footer.njk           NEW   {% macro render(lang, isHome) %}
src/index.njk       EDIT   migrate to extends base.njk
src/blog/index.njk  EDIT   migrate to extends base.njk
src/blog/post.njk   EDIT   migrate to extends base.njk
src/privacy.njk     EDIT   migrate to extends base.njk (inner <main> → <div>, see Task 10)
src/_data/locales/{ru,tj,en}.json  EDIT   remove footer.eyeExams/glasses/contacts/dryeye/followup (Task 11)
CLAUDE.md            EDIT   Task 12
```

**Migration order and why:** data files first (nothing consumes them yet, build is a no-op diff) → `sw.njk` (self-contained, verifiable in isolation) → partials (built and unit-verified with a standalone Nunjucks script before any page uses them) → pages migrated easiest-to-hardest (privacy → blog/post → blog/index → index) so mistakes surface on the smallest blast radius first → locale JSON cleanup only after no template references the old keys → docs.

---

### Task 1: Data layer — `assets.js`, `nav.js`, `site.js`, `services.js`

**Files:**
- Create: `src/_data/assets.js`
- Create: `src/_data/nav.js`
- Modify: `src/_data/site.js`
- Modify: `src/_data/services.js`

**Interfaces:**
- Produces: `assets.{cache,css,tailwind,blogCss,script,visionTest,visionDisorders}` (all strings) — consumed by `sw.njk` (Task 2) and `head-common.njk` (Task 3) and every migrated template's `scripts`/`tailwindStyles` blocks (Tasks 7–10).
- Produces: `nav` — array of `{key, hash, stringKey}` — consumed by `nav.njk` (Task 4).
- Produces: `site.social.{facebook,instagram,linkedin}` — consumed by `footer.njk` (Task 5).
- Produces: `services[i].footer` (boolean, only present/true on 5 entries) — consumed by `footer.njk` (Task 5).

- [x] **Step 1: Create `src/_data/assets.js`**

```javascript
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
  cache: "1.7.0",
  css: "1.6.0",
  tailwind: "1.6.0",
  blogCss: "1.6.0",
  script: "1.2.1",
  visionTest: "1.1.0",
  visionDisorders: "1.1.0",
};
```

(`cache` is bumped to `1.7.0` because `sw.js`'s own bytes change shape in Task 2 — a structural change to a precached-adjacent file, per CLAUDE.md's "bump on ANY asset change" rule. `css`/`tailwind`/`blogCss`/`script`/`visionTest`/`visionDisorders` stay at their current values: this migration does not change those files' bytes.)

- [x] **Step 2: Create `src/_data/nav.js`**

```javascript
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
```

- [x] **Step 3: Edit `src/_data/site.js` — add `social`**

Current end of file:
```javascript
  yearsExperience: buildYear - PRACTICE_START_YEAR,
};
```

Replace with:
```javascript
  yearsExperience: buildYear - PRACTICE_START_YEAR,

  // Canonical social profile URLs — read by the footer partial. Previously
  // hardcoded only inside src/index.njk's footer; the blog/privacy footers
  // had no source for them and shipped `href="#"` placeholders instead.
  social: {
    facebook: "https://www.facebook.com/sitorakarimi",
    instagram: "https://www.instagram.com/dr.sitora.karimova/",
    linkedin: "https://www.linkedin.com/in/sitorakarimi",
  },
};
```

- [x] **Step 4: Edit `src/_data/services.js` — flag the 5 footer services**

Current `SERVICES` array (lines 24–36):
```javascript
const SERVICES = [
  { key: 'comprehensive',        id: 'service-comprehensive',        icon: 'fa-eye' },
  { key: 'visometry',            id: 'service-visometry',            icon: 'fa-chart-line' },
  { key: 'autorefractometry',    id: 'service-autorefractometry',    icon: 'fa-microscope' },
  { key: 'subjective',           id: 'service-subjective',           icon: 'fa-glasses' },
  { key: 'accommodation',        id: 'service-accommodation',        icon: 'fa-expand' },
  { key: 'keratometry',          id: 'service-keratometry',          icon: 'fa-circle-notch' },
  { key: 'ophthalmoscopy',       id: 'service-ophthalmoscopy',       icon: 'fa-eye-dropper' },
  { key: 'prescriptionGlasses',  id: 'service-prescription-glasses', icon: 'fa-store' },
  { key: 'contactsAndTreatment', id: 'service-contacts',             icon: 'fa-circle-dot' },
  { key: 'dryEye',               id: 'service-dry-eye',              icon: 'fa-droplet' },
  { key: 'ongoingCare',          id: 'service-followup',             icon: 'fa-calendar-check' },
];
```

Replace with (adds `footer: true` to the 5 entries the footer already linked to — `comprehensive`, `prescriptionGlasses`, `contactsAndTreatment`, `dryEye`, `ongoingCare` — matching the homepage footer's current 5 links exactly):
```javascript
const SERVICES = [
  { key: 'comprehensive',        id: 'service-comprehensive',        icon: 'fa-eye',            footer: true },
  { key: 'visometry',            id: 'service-visometry',            icon: 'fa-chart-line' },
  { key: 'autorefractometry',    id: 'service-autorefractometry',    icon: 'fa-microscope' },
  { key: 'subjective',           id: 'service-subjective',           icon: 'fa-glasses' },
  { key: 'accommodation',        id: 'service-accommodation',        icon: 'fa-expand' },
  { key: 'keratometry',          id: 'service-keratometry',          icon: 'fa-circle-notch' },
  { key: 'ophthalmoscopy',       id: 'service-ophthalmoscopy',       icon: 'fa-eye-dropper' },
  { key: 'prescriptionGlasses',  id: 'service-prescription-glasses', icon: 'fa-store',          footer: true },
  { key: 'contactsAndTreatment', id: 'service-contacts',             icon: 'fa-circle-dot',     footer: true },
  { key: 'dryEye',               id: 'service-dry-eye',              icon: 'fa-droplet',        footer: true },
  { key: 'ongoingCare',          id: 'service-followup',             icon: 'fa-calendar-check', footer: true },
];
```

Also update the file's header comment (lines 1–22) to mention the footer now reads from here too — append this paragraph after the existing "To add a service:" line:

```javascript
// The footer's "Services" column also renders from this array (entries with
// `footer: true`), reading `services.<key>.title` from the locale JSON —
// eliminating a fifth, separate set of `footer.eyeExams`/`footer.glasses`/…
// strings that had already drifted in wording from these canonical titles.
```

- [x] **Step 5: Verify no-op build**

Run: `npm run build`
Expected: Build succeeds with no errors. `assets`, `nav`, `site.social`, and `services[i].footer` are not yet referenced by any template, so `git diff --stat _site/` (if `_site/` were tracked — it's gitignored, so instead diff rendered output) should show **zero rendered HTML differences**. Confirm via:

```bash
mkdir -p /tmp/site-baseline && cp -r _site/* /tmp/site-baseline/
npm run build
diff -rq _site/ /tmp/site-baseline/
```

Expected: no output from `diff -rq` (directories identical).

- [x] **Step 6: Commit**

```bash
git add src/_data/assets.js src/_data/nav.js src/_data/site.js src/_data/services.js
git commit -m "$(cat <<'EOF'
Add assets.js/nav.js data files, site.js social URLs, services.js footer flag

Groundwork for consolidating the four hand-duplicated head/nav/footer
copies into shared includes. Not yet consumed by any template — this is
additive only, verified as a no-op build.
EOF
)"
```

---

### Task 2: Convert `sw.js` → `src/sw.njk`

**Files:**
- Create: `src/sw.njk`
- Modify: `.eleventy.js:12` (remove the `sw.js` passthrough line)
- Delete: `sw.js` (root, only after Step 3 passes)

**Interfaces:**
- Consumes: `assets.{cache,css,tailwind,blogCss,script,visionTest,visionDisorders}` (Task 1).
- Produces: `_site/sw.js`, identical output path to today's passthrough-copied file.

- [x] **Step 1: Create `src/sw.njk`**

```
---
permalink: /sw.js
eleventyExcludeFromCollections: true
---
// Service Worker for sitorakarimi.com
// Handles caching for offline support and performance optimization
//
// Generated from src/sw.njk — every version below comes from
// src/_data/assets.js, the single source of truth. Do not hand-edit a
// version number here; edit assets.js and rebuild.

// Cache version - drives cache purge/cleanup for all clients
const CACHE_VERSION = '{{ assets.cache }}';
const CACHE_NAME = `sitorakarimi-${CACHE_VERSION}`;

// CSS version — must match the ?v= query string on /styles.css.
const CSS_VERSION = '{{ assets.css }}';

// Tailwind version — must match the ?v= query string on /tailwind.css.
const TAILWIND_VERSION = '{{ assets.tailwind }}';

// Assets to cache. Per-locale pages are listed so offline visitors see their
// language correctly. Root "/" is intentionally omitted — it 302-redirects to /ru/.
// NOTE: styles.css is versioned (?v=CSS_VERSION) so that when the file changes
// and we bump CSS_VERSION, the new URL is fetched fresh instead of the SW
// serving a stale copy from the browser's HTTP cache.
const ASSETS_TO_CACHE = [
    '/ru/',
    '/tj/',
    '/en/',
    '/script.js?v={{ assets.script }}',
    '/vision-test.js?v={{ assets.visionTest }}',
    '/vision-disorders.js?v={{ assets.visionDisorders }}',
    `/styles.css?v=${CSS_VERSION}`,
    `/tailwind.css?v=${TAILWIND_VERSION}`,
    '/favicon.svg',
    // Self-hosted Montserrat. Latin + Cyrillic are pre-cached because every
    // locale needs at least one of them; cyrillic-ext is Tajik-only and
    // latin-ext is a rarely-hit fallback, so both are left to fetch on demand
    // (the cache-first handler below stores them on first use).
    '/assets/fonts/montserrat-latin.woff2',
    '/assets/fonts/montserrat-cyrillic.woff2',
    '/assets/icons.svg',
    '/assets/images/hero.webp',
    '/assets/images/about-1.jpg',
    '/assets/images/about-1.webp',
    '/assets/images/about-2.webp',
    '/assets/images/about-2.jpg',
    '/assets/images/eyeglasses-vector-small.svg',
    '/assets/images/table-ru.svg',
    '/assets/images/og-image.webp',
    '/assets/images/vision-disorders.webp',
    '/blog/blog.css?v={{ assets.blogCss }}',
    '/blog/blog.js',
    '/ru/blog/',
    '/tj/blog/',
    '/en/blog/'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                // Use cache:'reload' so each fetch bypasses the browser's HTTP
                // cache and always pulls fresh bytes from the network.
                // Without this, cache.addAll() can store a stale response that
                // the browser's HTTP cache served (e.g. an old styles.css that
                // predates the glasses animation section), causing the SW to
                // serve that stale version on every subsequent language switch.
                const requests = ASSETS_TO_CACHE.map(
                    url => new Request(url, { cache: 'reload' })
                );
                return cache.addAll(requests);
            })
            .then(() => {
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches that don't match current version
                        if (cacheName !== CACHE_NAME && cacheName.startsWith('sitorakarimi-')) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - two strategies depending on resource type:
//
// HTML pages (locale pages like /ru/, /en/, /tj/):
//   Network-FIRST — always fetch fresh HTML from the server, fall back to
//   cache only when offline. This prevents stale-while-revalidate from
//   serving old HTML to language-switch navigations: the SW refreshes only
//   the page currently loaded; sibling locales can stay at their SW-install
//   vintage indefinitely under the old cache-first strategy.
//
// All other assets (JS, CSS, images, etc.):
//   Cache-FIRST — serve pre-cached assets instantly, fetch from network
//   only on a cache miss, and cache the result for future visits.
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (CDN, Google Tag Manager, etc.)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const isHTML = event.request.headers.get('accept') &&
                   event.request.headers.get('accept').includes('text/html');

    if (isHTML) {
        // ── Network-first for HTML ──────────────────────────────────────────
        // Locale pages are small static documents served from Netlify's CDN
        // edge — network round-trips are fast (< 100 ms on a good connection).
        // Always fetching fresh ensures language-switch navigations never see
        // a stale IIFE or stale markup.
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache the fresh response for offline fallback
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Offline: serve from cache; last resort falls back to the
                    // same locale the user was on, then /en/, then /ru/.
                    return caches.match(event.request)
                        .then((cached) => {
                            if (cached) return cached;
                            // Try to match the locale from the URL path (e.g. /en/, /ru/, /tj/)
                            const urlPath = new URL(event.request.url).pathname;
                            const localeMatch = urlPath.match(/^\/(en|ru|tj)\//);
                            const locale = localeMatch ? localeMatch[1] : 'en';
                            return caches.match(`/${locale}/`)
                                .then((localeFallback) => localeFallback || caches.match('/en/'));
                        });
                })
        );
    } else {
        // ── Cache-first for assets ──────────────────────────────────────────
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request)
                        .then((response) => {
                            if (!response || response.status !== 200 || response.type === 'error') {
                                return response;
                            }

                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                            return response;
                        })
                        .catch((error) => {
                            console.error('[Service Worker] Fetch failed:', error);
                            throw error;
                        });
                })
        );
    }
});

// Message event - allow clients to trigger cache refresh
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName.startsWith('sitorakarimi-')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    }
});
```

- [x] **Step 2: Remove the dead passthrough copy in `.eleventy.js`**

Current line 12:
```javascript
  eleventyConfig.addPassthroughCopy({ "sw.js": "sw.js" });
```

Delete this line entirely (the file no longer exists at the repo root once Step 4 runs; `src/sw.njk` renders to the same output path via its own `permalink`, so no passthrough entry is needed).

- [x] **Step 3: Build and diff `_site/sw.js` against the current file**

```bash
cp sw.js /tmp/sw.js.before
npm run build
diff /tmp/sw.js.before _site/sw.js
```

Expected: the only differences are `CACHE_VERSION` (`1.6.0` → `1.7.0`, intentional per Task 1) and the new header comment. Every `ASSETS_TO_CACHE` entry, every event listener, every code path must be byte-identical otherwise. If `diff` shows anything else, stop and fix `sw.njk` before proceeding.

- [x] **Step 4: Delete the root `sw.js`**

```bash
git rm sw.js
```

- [x] **Step 5: Rebuild and confirm `_site/sw.js` still renders correctly**

```bash
npm run build
node -e "new Function(require('fs').readFileSync('_site/sw.js', 'utf8'))"
```

Expected: no syntax errors (the `new Function(...)` call parses the file; it doesn't execute service-worker APIs, just validates the JS is syntactically valid).

- [x] **Step 6: Commit**

```bash
git add src/sw.njk .eleventy.js sw.js
git commit -m "$(cat <<'EOF'
Generate sw.js from src/sw.njk, reading versions from assets.js

Removes the last hand-typed copy of the CSS/Tailwind/script version
numbers. CACHE_VERSION bumped to 1.7.0 since the file's bytes change
shape (this is a real, if structural, asset change).
EOF
)"
```

---

### Task 3: `head-common.njk`, `gtm-loader.njk`, `gtm-noscript.njk`

**Files:**
- Create: `src/_includes/partials/head-common.njk`
- Create: `src/_includes/partials/gtm-loader.njk`
- Create: `src/_includes/partials/gtm-noscript.njk`

**Interfaces:**
- Consumes: `lang` (child-set before use), `assets.css` (Task 1).
- Produces: nothing callable — these are `{% include %}`d, not macros, since none take parameters. Used by `layouts/base.njk` (Task 6, for `head-common.njk`) and by individual pages' block fills (Tasks 7–10, for the two GTM snippets).

- [x] **Step 1: Create `src/_includes/partials/head-common.njk`**

```
{#
  Universal <head> content — byte-identical on every page regardless of
  type. Page-specific title/meta/OG/schema/Tailwind-delivery live in blocks
  in layouts/base.njk, filled per child template (see that file's header
  comment for the full list of blocks).
#}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">

<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate icon" href="/favicon.svg">

<!-- Fonts — self-hosted Montserrat (see @font-face note in styles.css).
     Preload only the subsets this locale actually renders: Latin is always
     needed, Cyrillic for ru/tg, and the Tajik-specific letters (ғ ӣ қ ӯ ҳ ҷ)
     live in cyrillic-ext. -->
<link rel="preload" href="/assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
{%- if lang in ['ru', 'tj'] %}
<link rel="preload" href="/assets/fonts/montserrat-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
{%- endif %}
{%- if lang == 'tj' %}
<link rel="preload" href="/assets/fonts/montserrat-cyrillic-ext.woff2" as="font" type="font/woff2" crossorigin>
{%- endif %}

<!-- Custom styles — version is src/_data/assets.js, the single source of truth -->
<link rel="stylesheet" href="/styles.css?v={{ assets.css }}">
```

- [x] **Step 2: Create `src/_includes/partials/gtm-loader.njk`**

```
<!-- Google Tag Manager (idle-deferred to avoid blocking LCP/FCP) -->
<script>
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
function _loadGTM() {
    var f = document.getElementsByTagName('script')[0],
        j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TBKDQH2B';
    f.parentNode.insertBefore(j, f);
}
if ('requestIdleCallback' in window) {
    requestIdleCallback(_loadGTM, { timeout: 4000 });
} else {
    setTimeout(_loadGTM, 3500);
}
</script>
<!-- End Google Tag Manager -->
```

- [x] **Step 3: Create `src/_includes/partials/gtm-noscript.njk`**

```
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TBKDQH2B"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

- [x] **Step 4: Verify with a standalone Nunjucks render (no Eleventy page consumes these yet)**

```bash
mkdir -p /tmp/nk-verify/partials
cp src/_includes/partials/head-common.njk src/_includes/partials/gtm-loader.njk src/_includes/partials/gtm-noscript.njk /tmp/nk-verify/partials/
cat > /tmp/nk-verify/test.njk <<'EOF'
{% include "partials/head-common.njk" %}
{% include "partials/gtm-loader.njk" %}
{% include "partials/gtm-noscript.njk" %}
EOF
node -e "
const nunjucks = require('$(pwd)/node_modules/nunjucks');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('/tmp/nk-verify'));
const out = env.render('test.njk', { lang: 'tj', assets: { css: '1.6.0' } });
console.log(out);
if (!out.includes('montserrat-cyrillic-ext.woff2')) throw new Error('tj should preload cyrillic-ext');
if (!out.includes('styles.css?v=1.6.0')) throw new Error('css version not substituted');
if (!out.includes('GTM-TBKDQH2B')) throw new Error('GTM id missing');
console.log('OK');
"
```

Expected: prints the rendered HTML, then `OK`, with no thrown error.

- [x] **Step 5: Commit**

```bash
git add src/_includes/partials/head-common.njk src/_includes/partials/gtm-loader.njk src/_includes/partials/gtm-noscript.njk
git commit -m "Add head-common and GTM partials (not yet wired into any page)"
```

---

### Task 4: `nav.njk` macro

**Files:**
- Create: `src/_includes/partials/nav.njk`

**Interfaces:**
- Consumes (explicit macro params): `lang` (string), `variant` (`'transparent'|'solid'`), `isHome` (boolean), `activeKey` (string, default `''`), `langSwitcherLinks` (array of `{code, name, href}` or `none`, default `none`).
- Consumes (from calling context via `with context` import): `t` (locale strings), `nav` (Task 1's `_data/nav.js`), `locales` (Eleventy global data).
- Produces: `{% macro render(lang, variant, isHome, activeKey='', langSwitcherLinks=none) %}` — consumed by `layouts/base.njk` (Task 6).

- [x] **Step 1: Create `src/_includes/partials/nav.njk`**

```
{#
  Single source for the site's primary navigation, desktop + mobile.

  Params:
    lang               locale code ('ru'|'tj'|'en')
    variant             'transparent' (homepage, hero sits behind it) |
                        'solid' (every other page)
    isHome              true only for src/index.njk. Controls: (1) whether
                        the logo is a plain mark or a link home, (2) whether
                        nav.js entries resolve to in-page anchors (#services)
                        or full paths (/{{lang}}/#services)
    activeKey           nav.js `key` to mark with `.active`, e.g. 'blog'.
                        Empty string (default) marks nothing.
    langSwitcherLinks   omit (or pass none) for the default JS-driven button
                        switcher (used on the homepage and blog listing,
                        where every locale's sibling page always exists at a
                        trivially-known path). Pass a list of
                        {code, name, href} to switch to real <a> links
                        instead (blog post — filtered to translated
                        locales only; privacy — all locales) since those
                        pages must NOT link to an untranslated sibling.

  Reads from the calling template's context (present on every page that
  extends layouts/base.njk): `t` (locale strings), `nav` (src/_data/nav.js,
  Eleventy global data), `locales` (src/_data/locales.js, global data).
#}
{% macro render(lang, variant, isHome, activeKey='', langSwitcherLinks=none) %}
{%- set navClass = 'fixed top-0 w-full bg-navy-900 z-50 transition-all shadow-lg' if variant == 'solid' else 'fixed w-full bg-transparent backdrop-blur-md z-50 transition-all' -%}
<nav class="{{ navClass }}" id="navbar">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
            {%- if isHome %}
            <div class="flex items-center space-x-2">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg class="svg-icon text-navy-900 text-xl" aria-hidden="true"><use href="/assets/icons.svg#fa-eye"></use></svg>
                </div>
                <span class="font-semibold text-lg text-white">Dr. Sitora Karimova</span>
            </div>
            {%- else %}
            <a href="/{{ lang }}/" class="flex items-center space-x-2 hover:opacity-90 transition-opacity">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg class="svg-icon text-navy-900 text-xl" aria-hidden="true"><use href="/assets/icons.svg#fa-eye"></use></svg>
                </div>
                <span class="font-semibold text-lg text-white">Dr. Sitora Karimova</span>
            </a>
            {%- endif %}
            <div class="hidden lg:flex items-center space-x-8">
                {%- for link in nav %}
                {%- if link.key == 'home' and not isHome %}
                {%- set href = '/' + lang + '/' %}
                {%- elif link.key == 'blog' %}
                {%- set href = '/' + lang + '/blog/' %}
                {%- elif isHome %}
                {%- set href = link.hash %}
                {%- else %}
                {%- set href = '/' + lang + '/' + link.hash %}
                {%- endif %}
                <a href="{{ href }}" class="nav-link-light{{ ' active' if link.key == activeKey else '' }}" data-i18n="nav.{{ link.stringKey }}">{{ t.nav[link.stringKey] | safe }}</a>
                {%- endfor %}

                <!-- Language Switcher -->
                <div class="relative language-switcher">
                    <button id="lang-btn" class="flex items-center space-x-2 text-white hover:text-coral transition-colors" aria-label="Language selector" aria-haspopup="true" aria-expanded="false">
                        <svg class="svg-icon text-lg" aria-hidden="true"><use href="/assets/icons.svg#fa-globe"></use></svg>
                        <span id="current-lang" class="text-sm font-medium">{{ lang | upper }}</span>
                        <svg class="svg-icon text-xs" aria-hidden="true"><use href="/assets/icons.svg#fa-chevron-down"></use></svg>
                    </button>
                    <div id="lang-menu" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl overflow-hidden z-50" role="menu">
                        {%- if langSwitcherLinks %}
                        {%- for l in langSwitcherLinks %}
                        <a href="{{ l.href }}" class="lang-option block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-coral hover:text-white transition-colors" role="menuitem">{{ l.name }}</a>
                        {%- endfor %}
                        {%- else %}
                        {%- for code, loc in locales %}
                        <button data-lang="{{ code }}" class="lang-option w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-coral hover:text-white transition-colors" role="menuitem">{{ loc.name }}</button>
                        {%- endfor %}
                        {%- endif %}
                    </div>
                </div>
            </div>
            <button class="lg:hidden text-white" id="mobile-menu-btn" aria-label="Toggle mobile menu" aria-expanded="false">
                <svg class="svg-icon text-2xl" aria-hidden="true"><use href="/assets/icons.svg#fa-bars"></use></svg>
            </button>
        </div>
    </div>
    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden lg:hidden bg-navy-900 border-t border-white/10">
        <div class="px-4 py-3 space-y-3">
            {%- for link in nav %}
            {%- if link.key == 'home' and not isHome %}
            {%- set href = '/' + lang + '/' %}
            {%- elif link.key == 'blog' %}
            {%- set href = '/' + lang + '/blog/' %}
            {%- elif isHome %}
            {%- set href = link.hash %}
            {%- else %}
            {%- set href = '/' + lang + '/' + link.hash %}
            {%- endif %}
            <a href="{{ href }}" class="block nav-link-light{{ ' active' if link.key == activeKey else '' }}" data-i18n="nav.{{ link.stringKey }}">{{ t.nav[link.stringKey] | safe }}</a>
            {%- endfor %}

            <!-- Mobile Language Switcher -->
            <div class="pt-3 border-t border-white/10">
                <p class="text-xs uppercase tracking-widest text-white/80 mb-2" data-i18n="nav.language">{{ t.nav.language | safe }}</p>
                <div class="flex gap-2">
                    {%- if langSwitcherLinks %}
                    {%- for l in langSwitcherLinks %}
                    <a href="{{ l.href }}" class="lang-option-mobile flex-1 px-3 py-2 text-sm text-white bg-white/10 rounded hover:bg-coral transition-colors text-center">{{ l.code | upper }}</a>
                    {%- endfor %}
                    {%- else %}
                    {%- for code, loc in locales %}
                    <button data-lang="{{ code }}" class="lang-option-mobile flex-1 px-3 py-2 text-sm text-white bg-white/10 rounded hover:bg-coral transition-colors">{{ code | upper }}</button>
                    {%- endfor %}
                    {%- endif %}
                </div>
            </div>
        </div>
    </div>
</nav>
{% endmacro %}
```

> **Note on `nav-link-light active` behavior**: `index.njk`'s desktop-nav-transparent variant currently sets no static `.active` class anywhere — `script.js`'s scroll handler applies it dynamically. This macro preserves that (homepage callers pass `activeKey=''`, so nothing gets the class server-side; JS still applies it client-side, unaffected). Only blog pages statically mark `.active` on `blog`, matching current behavior exactly.

- [x] **Step 2: Verify with a standalone Nunjucks render — button mode (homepage-style)**

```bash
mkdir -p /tmp/nk-verify/partials
cp src/_includes/partials/nav.njk /tmp/nk-verify/partials/
cat > /tmp/nk-verify/test-nav.njk <<'EOF'
{%- import "partials/nav.njk" as navPartial with context -%}
{{ navPartial.render('ru', 'transparent', true, '') }}
EOF
node -e "
const nunjucks = require('$(pwd)/node_modules/nunjucks');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('/tmp/nk-verify'));
const t = { nav: { home: 'Главная', services: 'Услуги', about: 'О нас', reviews: 'Отзывы', faq: 'Вопросы', contact: 'Контакты', blog: 'Блог', language: 'Язык' } };
const locales = { ru: { name: 'Русский' }, tj: { name: 'Тоҷикӣ' }, en: { name: 'English' } };
const nav = require('$(pwd)/src/_data/nav.js');
const out = env.render('test-nav.njk', { t, locales, nav });
console.log(out);
if (!out.includes('href=\"#services\"')) throw new Error('homepage should use bare hash anchors');
if (out.includes('/ru/#services')) throw new Error('homepage should NOT prefix /ru/ on its own anchors');
if (!out.includes('<button data-lang=\"ru\"')) throw new Error('button-mode switcher expected');
if ((out.match(/nav-link-light/g) || []).length !== 14) throw new Error('expected 7 desktop + 7 mobile links');
console.log('OK: button mode / homepage');
"
```

Expected: rendered HTML printed, then `OK: button mode / homepage`.

- [x] **Step 3: Verify anchor mode (blog-post-style, filtered language links)**

```bash
cat > /tmp/nk-verify/test-nav2.njk <<'EOF'
{%- import "partials/nav.njk" as navPartial with context -%}
{{ navPartial.render('ru', 'solid', false, 'blog', links) }}
EOF
node -e "
const nunjucks = require('$(pwd)/node_modules/nunjucks');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('/tmp/nk-verify'));
const t = { nav: { home: 'Главная', services: 'Услуги', about: 'О нас', reviews: 'Отзывы', faq: 'Вопросы', contact: 'Контакты', blog: 'Блог', language: 'Язык' } };
const locales = { ru: { name: 'Русский' }, en: { name: 'English' } };
const nav = require('$(pwd)/src/_data/nav.js');
const links = [{ code: 'ru', name: 'Русский', href: '/ru/blog/my-post/' }, { code: 'en', name: 'English', href: '/en/blog/my-post/' }];
const out = env.render('test-nav2.njk', { t, locales, nav, links });
console.log(out);
if (!out.includes('href=\"/ru/#services\"')) throw new Error('non-home should prefix /ru/');
if (!out.includes('href=\"/ru/\"')) throw new Error('home link off-homepage should be bare /ru/');
if (!out.includes('nav-link-light active')) throw new Error('blog should be marked active');
if (!out.includes('<a href=\"/en/blog/my-post/\"')) throw new Error('anchor-mode switcher expected, filtered to given links only');
if (out.includes('data-lang=')) throw new Error('anchor mode should not render button switcher');
console.log('OK: anchor mode / blog post');
"
```

Expected: rendered HTML printed, then `OK: anchor mode / blog post`.

- [x] **Step 4: Commit**

```bash
git add src/_includes/partials/nav.njk
git commit -m "Add shared nav.njk macro (button and anchor language-switcher modes)"
```

---

### Task 5: `footer.njk` macro

**Files:**
- Create: `src/_includes/partials/footer.njk`

**Interfaces:**
- Consumes (explicit macro params): `lang` (string), `isHome` (boolean).
- Consumes (from context): `t`, `services` (Task 1), `site` (Task 1).
- Produces: `{% macro render(lang, isHome) %}` — consumed by `layouts/base.njk` (Task 6).

- [x] **Step 1: Create `src/_includes/partials/footer.njk`**

```
{#
  Single source for the site's footer — now identical on every page
  (previously: 4 copies, with blog/privacy missing the Privacy link, dead
  `href="#"` social links, no LinkedIn, and a services column duplicating
  services.js under separately-drifted `footer.*` locale strings).

  Params:
    lang    locale code
    isHome  true only for src/index.njk — same anchor-vs-full-path logic
            as nav.njk

  Reads from context: `t` (locale strings), `services`
  (src/_data/services.js — the "Services" column renders entries flagged
  `footer: true`, reading `services.<key>.title`), `site`
  (src/_data/site.js, for `site.social.*`).
#}
{% macro render(lang, isHome) %}
<footer class="bg-gray-50 text-gray-600 py-16 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-12 mb-12">
            <div>
                <h3 class="font-medium text-navy-900 mb-4">Sitora Karimova</h3>
                <p class="text-sm font-light" data-i18n="footer.tagline">{{ t.footer.tagline | safe }}</p>
            </div>

            <div>
                <h3 class="font-medium text-navy-900 mb-4" data-i18n="footer.servicesTitle">{{ t.footer.servicesTitle | safe }}</h3>
                <ul class="space-y-2 text-sm font-light">
                    {%- for s in services %}
                    {%- if s.footer %}
                    <li><a href="{{ ('#' + s.id) if isHome else ('/' + lang + '/#' + s.id) }}" class="hover:text-coral transition-colors">{{ t.services[s.key].title | safe }}</a></li>
                    {%- endif %}
                    {%- endfor %}
                </ul>
            </div>

            <div>
                <h3 class="font-medium text-navy-900 mb-4" data-i18n="footer.infoTitle">{{ t.footer.infoTitle | safe }}</h3>
                <ul class="space-y-2 text-sm font-light">
                    <li><a href="{{ '#about' if isHome else ('/' + lang + '/#about') }}" class="hover:text-coral transition-colors" data-i18n="footer.about">{{ t.footer.about | safe }}</a></li>
                    <li><a href="{{ '#testimonials' if isHome else ('/' + lang + '/#testimonials') }}" class="hover:text-coral transition-colors" data-i18n="footer.reviews">{{ t.footer.reviews | safe }}</a></li>
                    <li><a href="/{{ lang }}/blog/" class="hover:text-coral transition-colors" data-i18n="nav.blog">{{ t.nav.blog | safe }}</a></li>
                    <li><a href="{{ '#contact' if isHome else ('/' + lang + '/#contact') }}" class="hover:text-coral transition-colors" data-i18n="footer.contact">{{ t.footer.contact | safe }}</a></li>
                    <li><a href="/{{ lang }}/privacy/" class="hover:text-coral transition-colors" data-i18n="footer.privacy">{{ t.footer.privacy | safe }}</a></li>
                </ul>
            </div>

            <div>
                <h3 class="font-medium text-navy-900 mb-4" data-i18n="footer.connect">{{ t.footer.connect | safe }}</h3>
                <div class="flex space-x-4">
                    <a href="{{ site.social.facebook }}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="text-gray-400 hover:text-coral transition-colors">
                        <svg class="svg-icon text-xl" aria-hidden="true"><use href="/assets/icons.svg#fa-facebook"></use></svg>
                    </a>
                    <a href="{{ site.social.instagram }}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-gray-400 hover:text-coral transition-colors">
                        <svg class="svg-icon text-xl" aria-hidden="true"><use href="/assets/icons.svg#fa-instagram"></use></svg>
                    </a>
                    <a href="{{ site.social.linkedin }}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="text-gray-400 hover:text-coral transition-colors">
                        <svg class="svg-icon text-xl" aria-hidden="true"><use href="/assets/icons.svg#fa-linkedin"></use></svg>
                    </a>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-200 pt-8">
            <p class="text-sm text-center font-light" data-i18n="footer.copyright">{{ t.footer.copyright | safe }}</p>
        </div>
    </div>
</footer>
{% endmacro %}
```

- [x] **Step 2: Verify with a standalone Nunjucks render**

```bash
mkdir -p /tmp/nk-verify/partials
cp src/_includes/partials/footer.njk /tmp/nk-verify/partials/
cat > /tmp/nk-verify/test-footer.njk <<'EOF'
{%- import "partials/footer.njk" as footerPartial with context -%}
{{ footerPartial.render('ru', false) }}
EOF
node -e "
const nunjucks = require('$(pwd)/node_modules/nunjucks');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('/tmp/nk-verify'));
const t = {
  footer: { tagline: 'x', servicesTitle: 'Услуги', infoTitle: 'Инфо', about: 'О нас', reviews: 'Отзывы', contact: 'Контакты', privacy: 'Конфиденциальность', connect: 'Связь', copyright: '© 2026' },
  services: {
    comprehensive: { title: 'Комплексный осмотр' },
    prescriptionGlasses: { title: 'Очки по рецепту' },
    contactsAndTreatment: { title: 'Контактные линзы' },
    dryEye: { title: 'Сухость глаз' },
    ongoingCare: { title: 'Наблюдение' },
  },
  nav: { blog: 'Блог' },
};
const services = require('$(pwd)/src/_data/services.js');
const site = require('$(pwd)/src/_data/site.js');
const out = env.render('test-footer.njk', { t, services, site });
console.log(out);
if (!out.includes('href=\"/ru/privacy/\"')) throw new Error('privacy link missing');
if (!out.includes(site.social.facebook)) throw new Error('facebook URL not sourced from site.js');
if (!out.includes('aria-label=\"LinkedIn\"')) throw new Error('linkedin missing');
if ((out.match(/<li><a/g) || []).length !== 10) throw new Error('expected 5 service links + 5 info links = 10 <li><a>');
console.log('OK: footer, non-home');
"
```

Expected: rendered HTML printed, then `OK: footer, non-home`.

- [x] **Step 3: Commit**

```bash
git add src/_includes/partials/footer.njk
git commit -m "Add shared footer.njk macro, sourced from services.js/site.js"
```

---

### Task 6: `layouts/base.njk`

**Files:**
- Create: `src/_includes/layouts/base.njk`

**Interfaces:**
- Consumes: everything documented in the file's own header comment (reproduced below) — must be set by every child template before `{% extends %}`.
- Produces: blocks `pageTitle`, `metaTags`, `stylesPreload`, `tailwindStyles`, `schema`, `headExtra`, `bodyStart`, `gtmNoscript`, `content`, `scripts`, `bodyEndExtra` — consumed by Tasks 7–10.

- [x] **Step 1: Create `src/_includes/layouts/base.njk`**

```
{#
  Shared page skeleton for every locale page (home, blog listing, blog post,
  privacy). Owns: doctype/html/head boilerplate, nav, footer, skip-link, and
  the window.__T__/__LANG__ handoff to client JS. Page-specific head content
  and body content come from child templates via blocks.

  Every child template MUST set these before {% extends "layouts/base.njk" %}:
    t          locale strings — {% set t = locales[lang].strings %}
    lang       locale code
    isHome     boolean — true only for src/index.njk
    navVariant 'transparent' | 'solid'
    bodyClass  full class="" value for <body>

  Optional (default shown):
    navActive          ''    — nav.js `key` to mark active, e.g. 'blog'
    langSwitcherLinks   none — list of {code, name, href}; omit for the
                              default JS button language switcher

  Blocks available to fill:
    pageTitle       <title> contents
    metaTags        description/author/robots/canonical/hreflang/OG/Twitter
    stylesPreload   optional <link rel="preload" as="style"> (index only)
    tailwindStyles  Tailwind delivery (inlined vs linked) + any extra
                    stylesheet links (e.g. blog/blog.css)
    schema          <script type="application/ld+json"> block(s)
    headExtra       anything else in <head> (hero preload, dns-prefetch,
                    idle GTM loader for blog/post — see gtm-loader.njk)
    bodyStart       content immediately after <body>, before the skip link
                    (index: page-loader div; blog post: AI-translation banner)
    gtmNoscript     {% include "partials/gtm-noscript.njk" %} on pages that
                    load GTM; omitted (stays empty) on privacy
    content         main page content — rendered inside <main id="main-content">
    scripts         page-specific <script src> tags (window.__T__/__LANG__ is
                    already emitted by this layout; don't repeat it)
    bodyEndExtra    anything after the scripts block (index: idle GTM loader
                    at end of body, matching its current position)
#}
{%- import "partials/nav.njk" as navPartial with context -%}
{%- import "partials/footer.njk" as footerPartial with context -%}
<!DOCTYPE html>
<html lang="{{ locales[lang].htmlLang }}">
<head>
    {% include "partials/head-common.njk" %}
    <title>{% block pageTitle %}{% endblock %}</title>
    {% block metaTags %}{% endblock %}
    {% block stylesPreload %}{% endblock %}
    {% block tailwindStyles %}{% endblock %}
    {% block schema %}{% endblock %}
    {% block headExtra %}{% endblock %}
</head>
<body class="{{ bodyClass }}"{% if not isHome %} data-lang="{{ lang }}"{% endif %}>
    {% block gtmNoscript %}{% endblock %}
    {% block bodyStart %}{% endblock %}

    <a href="#main-content" class="skip-to-content">Skip to main content</a>

    {{ navPartial.render(lang, navVariant, isHome, navActive or '', langSwitcherLinks or none) }}

    <main id="main-content" tabindex="-1">
        {% block content %}{% endblock %}
    </main>

    {{ footerPartial.render(lang, isHome) }}

    <script>window.__T__ = {{ t | dump | safe }}; window.__LANG__ = "{{ lang }}";</script>
    {% block scripts %}{% endblock %}
    {% block bodyEndExtra %}{% endblock %}
</body>
</html>
```

- [x] **Step 2: Verify with a standalone Nunjucks render exercising every block**

```bash
mkdir -p /tmp/nk-verify/layouts /tmp/nk-verify/partials
cp src/_includes/layouts/base.njk /tmp/nk-verify/layouts/
cp src/_includes/partials/*.njk /tmp/nk-verify/partials/
cat > /tmp/nk-verify/test-base.njk <<'EOF'
{%- set t = { nav: {home:'H',services:'S',about:'A',reviews:'R',faq:'F',contact:'C',blog:'B',language:'L'}, footer: {tagline:'x',servicesTitle:'x',infoTitle:'x',about:'x',reviews:'x',contact:'x',privacy:'x',connect:'x',copyright:'x'} } -%}
{%- set lang = 'ru' -%}
{%- set isHome = false -%}
{%- set navVariant = 'solid' -%}
{%- set bodyClass = 'font-light text-gray-700 bg-white' -%}
{%- set navActive = 'blog' -%}
{% extends "layouts/base.njk" %}
{% block pageTitle %}Test Title{% endblock %}
{% block content %}<p>hello</p>{% endblock %}
EOF
node -e "
const nunjucks = require('$(pwd)/node_modules/nunjucks');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('/tmp/nk-verify'));
const locales = { ru: { htmlLang: 'ru', name: 'Русский' }, tj: { htmlLang: 'tg', name: 'Тоҷикӣ' }, en: { htmlLang: 'en', name: 'English' } };
const services = require('$(pwd)/src/_data/services.js');
const site = require('$(pwd)/src/_data/site.js');
const nav = require('$(pwd)/src/_data/nav.js');
const out = env.render('test-base.njk', { locales, services, site, nav, assets: { css: '1.6.0' } });
console.log(out);
if (!out.includes('<title>Test Title</title>')) throw new Error('title block failed');
if (!out.includes('<p>hello</p>')) throw new Error('content block failed');
if (!out.includes('data-lang=\"ru\"')) throw new Error('non-home body should carry data-lang');
if (!out.includes('nav-link-light active')) throw new Error('navActive should propagate to nav macro');
if (!out.includes('window.__T__')) throw new Error('window.__T__ handoff missing');
if (!out.includes('skip-to-content')) throw new Error('skip link missing');
console.log('OK: base.njk full render');
"
```

Expected: rendered HTML printed, then `OK: base.njk full render`.

- [x] **Step 3: Commit**

```bash
git add src/_includes/layouts/base.njk
git commit -m "Add layouts/base.njk shared page skeleton (not yet used by any page)"
```

---

### Task 7: Migrate `src/privacy.njk`

Easiest page: shortest head, minimal body, currently the outlier with a copyright-only footer (which becomes the full footer here — the one approved visual change).

**Files:**
- Modify: `src/privacy.njk` (full rewrite of body, keep front matter as-is)

**Interfaces:**
- Consumes: `layouts/base.njk` blocks (Task 6), `assets.tailwind` (Task 1).

- [x] **Step 1: Capture baseline rendered output**

```bash
npm run build
cp -r _site/ru/privacy /tmp/privacy-baseline-ru
cp -r _site/tj/privacy /tmp/privacy-baseline-tj
cp -r _site/en/privacy /tmp/privacy-baseline-en
```

- [x] **Step 2: Rewrite `src/privacy.njk`**

Keep the existing front matter (lines 1–9) unchanged. Replace everything from `{%- set t = ... %}` onward with:

```
{%- set t = locales[lang].strings -%}
{%- set pr = t.privacy -%}
{%- set isHome = false -%}
{%- set navVariant = 'solid' -%}
{%- set bodyClass = 'font-light text-gray-700 bg-white' -%}
{%- set langSwitcherLinks = [] -%}
{%- for code, loc in locales -%}
{%- set _ = langSwitcherLinks.push({ code: code, name: loc.name, href: '/' + code + '/privacy/' }) -%}
{%- endfor -%}
{% extends "layouts/base.njk" %}

{% block pageTitle %}{{ pr.metaTitle }}{% endblock %}

{% block metaTags %}
    <meta name="description" content="{{ pr.metaDescription }}">
    <meta name="author" content="Dr. Sitora Karimova">

    <!-- A policy page carries no ranking value and should not compete with the
         real pages in search — index it (users may look for it) but keep it out
         of snippets. -->
    <meta name="robots" content="index, follow, max-snippet:0">

    <link rel="canonical" href="https://sitorakarimi.com/{{ lang }}/privacy/">
    {%- for code, loc in locales %}
    <link rel="alternate" hreflang="{{ loc.hreflang }}" href="https://sitorakarimi.com/{{ code }}/privacy/">
    {%- endfor %}
    <link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/privacy/">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sitorakarimi.com/{{ lang }}/privacy/">
    <meta property="og:site_name" content="Dr. Sitora Karimova Ophthalmology">
    <meta property="og:title" content="{{ pr.metaTitle }}">
    <meta property="og:description" content="{{ pr.metaDescription }}">
    <meta property="og:locale" content="{{ locales[lang].ogLocale }}">
    <meta property="og:image" content="https://sitorakarimi.com/assets/images/og-image.jpg">
{% endblock %}

{% block tailwindStyles %}
    <link rel="stylesheet" href="/tailwind.css?v={{ assets.tailwind }}">
{% endblock %}

{% block schema %}
    <!-- Structured Data: BreadcrumbList (mirrors the visible breadcrumb below) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": {{ t.nav.home | striptags | dump | safe }},
                "item": "https://sitorakarimi.com/{{ lang }}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": {{ pr.title | dump | safe }},
                "item": "https://sitorakarimi.com/{{ lang }}/privacy/"
            }
        ]
    }
    </script>
{% endblock %}

{% block content %}
    <!-- Header -->
    <header class="pt-32 pb-12 bg-gradient-to-b from-navy-900 to-navy-800">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="mb-6" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2 text-sm text-white/50">
                    <li><a href="/{{ lang }}/" class="hover:text-white transition-colors">{{ t.nav.home | safe }}</a></li>
                    <li><svg class="svg-icon text-[10px]" aria-hidden="true"><use href="/assets/icons.svg#fa-chevron-right"></use></svg></li>
                    <li class="text-white/80">{{ pr.title }}</li>
                </ol>
            </nav>
            <h1 class="text-3xl md:text-5xl font-light text-white mb-4">{{ pr.title }}</h1>
            <p class="text-sm text-white/60">{{ pr.lastUpdated }}</p>
        </div>
    </header>

    <!-- Body -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p class="text-lg text-gray-600 leading-relaxed mb-12">{{ pr.intro }}</p>

        {#- .no-reveal keeps script.js's scroll-in animation off the policy text:
            it must be readable immediately and must survive printing / save-as-PDF. -#}
        {%- for section in pr.sections %}
        <section class="mb-10 no-reveal">
            <h2 class="text-2xl font-medium text-navy-900 mb-4">{{ section.heading }}</h2>
            <div class="privacy-body text-gray-600 leading-relaxed">{{ section.body | safe }}</div>
        </section>
        {%- endfor %}

        <div class="mt-12 pt-8 border-t border-gray-200">
            <a href="/{{ lang }}/" class="inline-flex items-center text-sm font-medium text-navy-900 hover:text-coral transition-colors">
                <svg class="svg-icon mr-2" aria-hidden="true"><use href="/assets/icons.svg#fa-arrow-left"></use></svg> {{ t.nav.home | safe }}
            </a>
        </div>
    </div>
{% endblock %}

{% block scripts %}
    {#- script.js reads window.__T__ for the service-worker update toast; without
        it the toast would render with empty labels on this page. -#}
    <script src="/script.js?v={{ assets.script }}" defer></script>
{% endblock %}
```

Note: the inner `<main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">` from the old file becomes a `<div>` with the same classes (highlighted above) — `layouts/base.njk` now supplies the page's one-and-only `<main>` landmark, and nested `<main>` elements are invalid HTML. Also note `og:image` changed from `og-image.webp` to `og-image.jpg` — this is a bug fix: CLAUDE.md's Netlify section states "OG image is JPEG... don't switch og:image back to webp," and privacy.njk was the one page still on `.webp`.

- [x] **Step 3: Build and diff against baseline**

```bash
npm run build
diff -u /tmp/privacy-baseline-ru/index.html _site/ru/privacy/index.html
```

Expected differences ONLY:
- `og:image` now ends `.jpg` instead of `.webp`
- Inner `<main class="max-w-3xl ...">` is now `<div class="max-w-3xl ...">`
- Footer grows from the single copyright line to the full 4-column footer (approved change)
- Nav grows from 5 links to 7 (Reviews, FAQ added), and the desktop language switcher now shows full names (Русский/Тоҷикӣ/English) sourced from `locales.js` instead of anchors that were already using `loc.name` (no visible change there — privacy's switcher was already anchor-based using `loc.name`)
- A skip-to-content link now exists in the markup (invisible unless focused — confirmed via `styles.css:494` `top: -100px` until `:focus`)
- `<html lang>`/hreflang/canonical/JSON-LD unchanged

If anything else differs, stop and fix before proceeding. Repeat for `tj` and `en`:

```bash
diff -u /tmp/privacy-baseline-tj/index.html _site/tj/privacy/index.html
diff -u /tmp/privacy-baseline-en/index.html _site/en/privacy/index.html
```

- [x] **Step 4: Validate JSON-LD still parses**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('_site/ru/privacy/index.html', 'utf8');
const matches = [...html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];
if (matches.length !== 1) throw new Error('expected exactly 1 JSON-LD block, found ' + matches.length);
JSON.parse(matches[0][1]);
console.log('OK: privacy JSON-LD valid');
"
```

- [x] **Step 5: Manual check — build and serve locally**

```bash
npm run build
python3 -m http.server 8080 --directory _site &
```

Open `http://localhost:8080/ru/privacy/` in a browser (or via claude-in-chrome). Confirm: nav shows 7 links and highlights nothing as active, footer shows all 4 columns with working Facebook/Instagram/LinkedIn links and a working Privacy Policy self-link, Tab key reveals the skip-to-content pill, mobile menu opens/closes. Then stop the server:

```bash
kill %1
```

- [x] **Step 6: Commit**

```bash
git add src/privacy.njk
git commit -m "$(cat <<'EOF'
Migrate privacy.njk to shared base layout

Fixes: og:image was still .webp (CLAUDE.md requires .jpg); footer grows
from copyright-only to the full 4-column footer (approved change) with
working social links and a self-referential Privacy link; nav gains the
Reviews/FAQ links every other page already had; adds a skip-to-content
link (inert until focused).
EOF
)"
```

---

### Task 8: Migrate `src/blog/post.njk`

**Files:**
- Modify: `src/blog/post.njk`

**Interfaces:**
- Consumes: `layouts/base.njk` blocks, `assets.{tailwind,blogCss,script}` — wait, blog pages load `blog.js` not `script.js`; consumes `assets.{tailwind,blogCss}` only.

- [ ] **Step 1: Capture baseline**

```bash
npm run build
cp -r _site/ru/blog /tmp/blog-post-baseline-ru
```//pick one representative post directory for the diff in Step 3, e.g. the first post's slug

- [ ] **Step 2: Rewrite `src/blog/post.njk`**

Keep front matter (lines 1–9) unchanged. Replace everything from `{%- set t = ... %}` onward with:

```
{%- set t = locales[item.lang].strings -%}
{%- set post = item.post -%}
{%- set p = post[item.lang] -%}
{%- set lang = item.lang -%}
{%- set isHome = false -%}
{%- set navVariant = 'solid' -%}
{%- set navActive = 'blog' -%}
{%- set bodyClass = 'font-light text-gray-700 bg-white' -%}
{%- set langSwitcherLinks = [] -%}
{%- for code, loc in locales -%}
{%- if post[code] -%}
{%- set _ = langSwitcherLinks.push({ code: code, name: loc.name, href: '/' + code + '/blog/' + post.slug + '/' }) -%}
{%- endif -%}
{%- endfor -%}
{% extends "layouts/base.njk" %}

{% block pageTitle %}{{ p.title }} — Dr. Sitora Karimova{% endblock %}

{% block metaTags %}
    <meta name="description" content="{{ p.metaDescription }}">
    <meta name="author" content="{{ post.author | default('Dr. Sitora Karimova') }}">

    <meta name="robots" content="index, follow, max-image-preview:large">

    <link rel="canonical" href="https://sitorakarimi.com/{{ lang }}/blog/{{ post.slug }}/">

    {%- for code, loc in locales %}
    {%- if post[code] %}
    <link rel="alternate" hreflang="{{ loc.hreflang }}" href="https://sitorakarimi.com/{{ code }}/blog/{{ post.slug }}/">
    {%- endif %}
    {%- endfor %}
    <link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/blog/{{ post.slug }}/">

    <meta property="og:type" content="article">
    <meta property="og:url" content="https://sitorakarimi.com/{{ lang }}/blog/{{ post.slug }}/">
    <meta property="og:site_name" content="Dr. Sitora Karimova Ophthalmology">
    <meta property="og:title" content="{{ p.title }}">
    <meta property="og:description" content="{{ p.metaDescription }}">
    {#- og:locale wants a territory code (ru_RU), not a bare language tag. -#}
    <meta property="og:locale" content="{{ locales[lang].ogLocale }}">
    {#- Fall back to the site OG image so a post without its own art still
        unfurls as a card rather than a bare link. -#}
    <meta property="og:image" content="https://sitorakarimi.com{{ post.image | default('/assets/images/og-image.jpg') }}">
    <meta property="article:published_time" content="{{ post.date }}">
    <meta property="article:author" content="{{ post.author | default('Dr. Sitora Karimova') }}">
    {%- if post.category %}
    <meta property="article:section" content="{{ post.category }}">
    {%- endif %}
    {%- for tag in post.tags %}
    <meta property="article:tag" content="{{ tag }}">
    {%- endfor %}

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ p.title }}">
    <meta name="twitter:description" content="{{ p.metaDescription }}">
    <meta name="twitter:image" content="https://sitorakarimi.com{{ post.image | default('/assets/images/og-image.jpg') }}">
{% endblock %}

{% block tailwindStyles %}
    <link rel="stylesheet" href="/tailwind.css?v={{ assets.tailwind }}">
    <link rel="stylesheet" href="/blog/blog.css?v={{ assets.blogCss }}">
{% endblock %}

{% block schema %}
    <!-- Structured Data: Article -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        {#- Values are injected with `| dump | safe` (which emits its own quotes).
            A raw "{{ p.title }}" breaks the whole JSON-LD block the moment a
            title contains a double quote — Nunjucks autoescape would turn it
            into &quot;, which is not valid JSON either. -#}
        "headline": {{ p.title | dump | safe }},
        "description": {{ p.metaDescription | dump | safe }},
        "datePublished": "{{ post.date }}",
        "dateModified": "{{ post.updated | default(post.date) }}",
        "url": "https://sitorakarimi.com/{{ lang }}/blog/{{ post.slug }}/",
        "inLanguage": "{{ locales[lang].htmlLang }}",
        {%- if post.image %}
        "image": "https://sitorakarimi.com{{ post.image }}",
        {%- endif %}
        "author": {
            "@type": "Person",
            "name": {{ post.author | default('Dr. Sitora Karimova') | dump | safe }},
            "jobTitle": "Ophthalmologist",
            "url": "https://sitorakarimi.com/{{ lang }}/"
        },
        {%- if post.category %}
        "articleSection": {{ (t.blog.categories[post.category] or post.category) | dump | safe }},
        {%- endif %}
        {%- if post.tags and post.tags.length %}
        "keywords": {{ post.tags | join(", ") | dump | safe }},
        {%- endif %}
        {%- if post.source and post.source.url %}
        "citation": {{ post.source.url | dump | safe }},
        {%- endif %}
        "publisher": {
            "@type": "Organization",
            "name": "Dr. Sitora Karimova Ophthalmology",
            "url": "https://sitorakarimi.com",
            {#- Google's Article guidance asks for a publisher logo. -#}
            "logo": {
                "@type": "ImageObject",
                "url": "https://sitorakarimi.com/assets/images/og-image.jpg"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://sitorakarimi.com/{{ lang }}/blog/{{ post.slug }}/"
        }
    }
    </script>

    <!-- Structured Data: BreadcrumbList (mirrors the visible breadcrumb below) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": {{ t.nav.home | striptags | dump | safe }},
                "item": "https://sitorakarimi.com/{{ lang }}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": {{ t.nav.blog | striptags | dump | safe }},
                "item": "https://sitorakarimi.com/{{ lang }}/blog/"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": {{ p.title | striptags | dump | safe }},
                "item": "https://sitorakarimi.com/{{ lang }}/blog/{{ post.slug }}/"
            }
        ]
    }
    </script>
{% endblock %}

{% block headExtra %}
    {% include "partials/gtm-loader.njk" %}
{% endblock %}

{% block gtmNoscript %}
    {% include "partials/gtm-noscript.njk" %}
{% endblock %}

{% block bodyStart %}
    <!-- AI Translation Banner -->
    {%- if post.aiTranslated and lang in post.aiTranslated %}
    <div class="ai-translation-banner">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
            <svg class="svg-icon text-sm"><use href="/assets/icons.svg#fa-language"></use></svg>
            <span>{{ t.blog.aiTranslatedBanner | safe }}</span>
            {%- if post.en %}
            <a href="/en/blog/{{ post.slug }}/" class="underline hover:no-underline ml-1">{{ t.blog.viewOriginal | safe }}</a>
            {%- endif %}
        </div>
    </div>
    {%- endif %}
{% endblock %}

{% block content %}
    <!-- Article -->
    <article class="blog-post">
        <!-- Post Header -->
        <header class="pt-32 pb-12 bg-gradient-to-b from-navy-900 to-navy-800">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Breadcrumb -->
                <nav class="mb-6" aria-label="Breadcrumb">
                    <ol class="flex items-center space-x-2 text-sm text-white/50">
                        <li><a href="/{{ lang }}/" class="hover:text-white transition-colors">{{ t.nav.home | safe }}</a></li>
                        <li><svg class="svg-icon text-[10px]"><use href="/assets/icons.svg#fa-chevron-right"></use></svg></li>
                        <li><a href="/{{ lang }}/blog/" class="hover:text-white transition-colors">{{ t.nav.blog | safe }}</a></li>
                        <li><svg class="svg-icon text-[10px]"><use href="/assets/icons.svg#fa-chevron-right"></use></svg></li>
                        <li class="text-white/80 truncate max-w-[200px]">{{ p.title | safe }}</li>
                    </ol>
                </nav>

                {%- if post.category %}
                <span class="inline-block text-xs uppercase tracking-widest font-medium text-coral mb-3">{{ t.blog.categories[post.category] | default(post.category) | safe }}</span>
                {%- endif %}

                <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">{{ p.title | safe }}</h1>

                <div class="flex flex-wrap items-center gap-4 text-sm text-white/60">
                    {%- if post.author %}
                    <span class="flex items-center gap-2">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-user-md"></use></svg> {{ post.author }}
                    </span>
                    {%- endif %}
                    <span class="flex items-center gap-2">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-regular-calendar"></use></svg> {{ post.date }}
                    </span>
                    {%- if post.readingTime %}
                    <span class="flex items-center gap-2">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-regular-clock"></use></svg> {{ post.readingTime }} {{ t.blog.minRead | safe }}
                    </span>
                    {%- endif %}
                </div>
            </div>
        </header>

        {%- if post.image %}
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
            <div class="rounded-lg overflow-hidden shadow-lg">
                {#- .blog-hero-img pins a 16/9 box via CSS aspect-ratio so the
                    slot is reserved before the image decodes (no CLS). Source
                    images vary slightly (1376x768, 1408x768), so a CSS ratio +
                    object-fit:cover is more reliable than per-post attributes. -#}
                <img src="{{ post.image }}" alt="{{ p.title }}" class="w-full blog-hero-img"
                     width="1376" height="768" fetchpriority="high"
                     onerror="this.parentElement.style.display='none'">
            </div>
        </div>
        {%- endif %}

        <!-- Post Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="blog-content prose prose-lg max-w-none" id="blog-content">
                {{ p.content | safe }}
            </div>

            {%- if post.source and post.source.name %}
            <div class="mt-12 pt-6 border-t border-gray-200">
                <p class="text-sm text-gray-400">
                    {{ t.blog.sourceLabel | safe }}: <em>{{ post.source.name }}</em>
                    {%- if post.source.date %} ({{ post.source.date }}){%- endif %}
                </p>
            </div>
            {%- endif %}

            {%- if post.tags and post.tags.length %}
            <div class="mt-8 flex flex-wrap gap-2">
                {%- for tag in post.tags %}
                <span class="blog-tag">#{{ tag }}</span>
                {%- endfor %}
            </div>
            {%- endif %}

            {#- Conversion + internal-linking block. Before this, blog posts linked
                back into the site only via the nav/footer chrome — every article
                page had no contextual link to services or contact, and a plain
                tel: number as the only call to action. -#}
            <aside class="blog-cta mt-12">
                <h2 class="blog-cta-heading">{{ t.blog.ctaHeading | safe }}</h2>
                <p class="blog-cta-text">{{ t.blog.ctaText | safe }}</p>
                {#- White-on-navy, not .btn-navy/.btn-outline: this block's
                    background is the navy gradient, so a navy button would be
                    invisible against it. -#}
                <div class="blog-cta-actions">
                    <a href="/{{ lang }}/#contact" class="btn-white">{{ t.blog.ctaButton | safe }}</a>
                    <a href="/{{ lang }}/#services" class="btn-outline-white">{{ t.blog.ctaServices | safe }}</a>
                </div>
            </aside>

            <!-- Share & Back -->
            <div class="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <a href="/{{ lang }}/blog/" class="inline-flex items-center text-sm font-medium text-navy-900 hover:text-coral transition-colors">
                    <svg class="svg-icon mr-2"><use href="/assets/icons.svg#fa-arrow-left"></use></svg> {{ t.blog.backToBlog | safe }}
                </a>
                <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-400">{{ t.blog.share | safe }}:</span>
                    <button onclick="shareTo('twitter')" class="blog-share-btn" aria-label="Share on Twitter">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-twitter"></use></svg>
                    </button>
                    <button onclick="shareTo('facebook')" class="blog-share-btn" aria-label="Share on Facebook">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-facebook-f"></use></svg>
                    </button>
                    <button onclick="shareTo('telegram')" class="blog-share-btn" aria-label="Share on Telegram">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-telegram"></use></svg>
                    </button>
                    <button onclick="copyLink()" class="blog-share-btn" aria-label="Copy link" id="copy-link-btn">
                        <svg class="svg-icon"><use href="/assets/icons.svg#fa-link"></use></svg>
                    </button>
                </div>
            </div>
        </div>
        {#- Related posts — ranked in src/_data/blogPages.js (shared category, then
            shared tags, then recency). Always same-language: `related` is built
            per locale and only includes posts translated into it. -#}
        {%- if item.related and item.related.length %}
        <section class="bg-gray-50 border-t border-gray-200 py-16">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-medium text-navy-900 mb-8">{{ t.blog.relatedTitle | safe }}</h2>
                <div class="grid gap-6 md:grid-cols-3">
                    {%- for r in item.related %}
                    {%- set rp = r[lang] %}
                    <article class="blog-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        {%- if r.image %}
                        <a href="/{{ lang }}/blog/{{ r.slug }}/" class="block overflow-hidden" tabindex="-1" aria-hidden="true">
                            <img src="{{ r.image }}" alt="" loading="lazy" width="1376" height="768"
                                 class="w-full blog-hero-img">
                        </a>
                        {%- endif %}
                        <div class="p-5">
                            {%- if r.category %}
                            <span class="blog-category text-xs uppercase tracking-wider font-medium text-coral">{{ t.blog.categories[r.category] | default(r.category) | safe }}</span>
                            {%- endif %}
                            <h3 class="text-base font-medium text-navy-900 mt-2 leading-snug">
                                <a href="/{{ lang }}/blog/{{ r.slug }}/" class="hover:text-coral transition-colors">{{ rp.title | safe }}</a>
                            </h3>
                        </div>
                    </article>
                    {%- endfor %}
                </div>
            </div>
        </section>
        {%- endif %}
    </article>
{% endblock %}

{% block scripts %}
    <script src="/blog/blog.js"></script>
{% endblock %}
```

- [ ] **Step 3: Build and diff**

```bash
npm run build
diff -rq /tmp/blog-post-baseline-ru _site/ru/blog --exclude=index.html
for d in _site/ru/blog/*/; do
  slug=$(basename "$d")
  [ "$slug" = "" ] && continue
  diff -u "/tmp/blog-post-baseline-ru/$slug/index.html" "_site/ru/blog/$slug/index.html" || true
done | less
```

Expected differences ONLY: footer link set grows (Reviews/FAQ links appear in nav — wait, blog nav already had 5; the two ADDED are Reviews and FAQ), footer social links become real URLs + LinkedIn appears, footer gains a Privacy link, footer service links change from 3 generic `/{{lang}}/#services` entries to 5 specific `#service-*` anchored entries with correct per-service titles, skip-to-content link added, `<h4>` → `<h3>` on footer column headings (invisible — Tailwind Preflight resets heading font-size to inherit).

- [ ] **Step 4: Validate JSON-LD**

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = fs.readdirSync('_site/ru/blog').find(d => fs.statSync(path.join('_site/ru/blog', d)).isDirectory());
const html = fs.readFileSync(path.join('_site/ru/blog', dir, 'index.html'), 'utf8');
const matches = [...html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];
if (matches.length !== 2) throw new Error('expected Article + BreadcrumbList, found ' + matches.length);
matches.forEach(m => JSON.parse(m[1]));
console.log('OK: blog post JSON-LD valid,', matches.length, 'blocks');
"
```

- [ ] **Step 5: Manual check — language switcher filters correctly**

```bash
npm run build
python3 -m http.server 8080 --directory _site &
```

Open a post that is NOT translated into all 3 languages (check `src/_data/blog/posts/*.json` for one with fewer than 3 language keys, or use any post and inspect the rendered `#lang-menu`). Confirm the language dropdown only lists locales the post actually has — this is the one behavior the anchor-mode `langSwitcherLinks` filter must get right; a regression here would link to a 404. Then:

```bash
kill %1
```

- [ ] **Step 6: Commit**

```bash
git add src/blog/post.njk
git commit -m "$(cat <<'EOF'
Migrate blog/post.njk to shared base layout

Fixes: dead social footer links, missing LinkedIn, missing Privacy
link, footer services generic-linked instead of per-service anchors,
nav missing Reviews/FAQ. Language switcher's translated-locales-only
filter preserved exactly (verified manually against an untranslated post).
EOF
)"
```

---

### Task 9: Migrate `src/blog/index.njk`

**Files:**
- Modify: `src/blog/index.njk`

- [ ] **Step 1: Capture baseline**

```bash
npm run build
cp -r _site/ru/blog/index.html /tmp/blog-index-baseline-ru.html
```

- [ ] **Step 2: Rewrite `src/blog/index.njk`**

Keep front matter (lines 1–9) unchanged. Replace everything from `{%- set t = ... %}` onward with:

```
{%- set t = locales[lang].strings -%}
{%- set posts = blogPosts -%}
{%- set isHome = false -%}
{%- set navVariant = 'solid' -%}
{%- set navActive = 'blog' -%}
{%- set bodyClass = 'font-light text-gray-700 bg-white' -%}
{% extends "layouts/base.njk" %}

{% block pageTitle %}{{ t.blog.metaTitle }}{% endblock %}

{% block metaTags %}
    <meta name="description" content="{{ t.blog.metaDescription }}">
    <meta name="author" content="Dr. Sitora Karimova">

    <meta name="robots" content="index, follow, max-image-preview:large">

    <link rel="canonical" href="https://sitorakarimi.com/{{ lang }}/blog/">

    {%- for code, loc in locales %}
    <link rel="alternate" hreflang="{{ loc.hreflang }}" href="https://sitorakarimi.com/{{ code }}/blog/">
    {%- endfor %}
    <link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/blog/">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sitorakarimi.com/{{ lang }}/blog/">
    <meta property="og:site_name" content="Dr. Sitora Karimova Ophthalmology">
    <meta property="og:title" content="{{ t.blog.metaTitle }}">
    <meta property="og:description" content="{{ t.blog.metaDescription }}">
    <meta property="og:locale" content="{{ locales[lang].ogLocale }}">
    {#- Without an og:image this page previewed as a bare link on social and in
        AI/chat unfurls, despite declaring summary_large_image below. -#}
    <meta property="og:image" content="https://sitorakarimi.com/assets/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ t.blog.metaTitle }}">
    <meta name="twitter:description" content="{{ t.blog.metaDescription }}">
    <meta name="twitter:image" content="https://sitorakarimi.com/assets/images/og-image.jpg">
{% endblock %}

{% block tailwindStyles %}
    <link rel="stylesheet" href="/tailwind.css?v={{ assets.tailwind }}">
    <link rel="stylesheet" href="/blog/blog.css?v={{ assets.blogCss }}">
{% endblock %}

{% block schema %}
    <!-- Structured Data: Blog -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": {{ t.blog.metaTitle | dump | safe }},
        "description": {{ t.blog.metaDescription | dump | safe }},
        "url": "https://sitorakarimi.com/{{ lang }}/blog/",
        "inLanguage": "{{ locales[lang].htmlLang }}",
        "publisher": {
            "@type": "Person",
            "name": "Dr. Sitora Karimova",
            "jobTitle": "Ophthalmologist",
            "url": "https://sitorakarimi.com/{{ lang }}/"
        }
    }
    </script>
{% endblock %}

{% block headExtra %}
    {% include "partials/gtm-loader.njk" %}
{% endblock %}

{% block gtmNoscript %}
    {% include "partials/gtm-noscript.njk" %}
{% endblock %}

{% block content %}
    <!-- Blog Header -->
    <section class="pt-32 pb-12 bg-gradient-to-b from-navy-900 to-navy-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-coral text-sm uppercase tracking-widest mb-3 font-medium">{{ t.blog.subtitle | safe }}</p>
            <h1 class="text-4xl md:text-5xl font-semibold text-white mb-4">{{ t.blog.title | safe }}</h1>
            <p class="text-white/70 text-lg max-w-2xl mx-auto font-light">{{ t.blog.description | safe }}</p>
        </div>
    </section>

    <!-- Blog Posts Grid -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {%- if posts.length > 0 %}
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {%- for post in posts %}
                {%- if post[lang] %}
                {%- set p = post[lang] %}
                <article class="blog-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    {%- if post.image %}
                    <a href="/{{ lang }}/blog/{{ post.slug }}/" class="block overflow-hidden">
                        <div class="blog-card-image aspect-[16/10] bg-gray-100 flex items-center justify-center">
                            <img src="{{ post.image }}" alt="{{ p.title }}" class="w-full h-full object-cover" loading="lazy"
                                 onerror="this.parentElement.innerHTML='<div class=\'flex items-center justify-center w-full h-full bg-gradient-to-br from-navy-900/5 to-coral/5\'><svg class=\'svg-icon text-4xl text-navy-900/20\'><use href=\'/assets/icons.svg#fa-newspaper\'></use></svg></div>'">
                        </div>
                    </a>
                    {%- endif %}
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            {%- if post.category %}
                            <span class="blog-category text-xs uppercase tracking-wider font-medium text-coral">{{ t.blog.categories[post.category] | default(post.category) | safe }}</span>
                            {%- endif %}
                            <span class="text-xs text-gray-400">{{ post.date }}</span>
                            {%- if post.readingTime %}
                            <span class="text-xs text-gray-400"><svg class="svg-icon"><use href="/assets/icons.svg#fa-regular-clock"></use></svg> {{ post.readingTime }} {{ t.blog.minRead | safe }}</span>
                            {%- endif %}
                        </div>
                        <h2 class="text-lg font-medium text-navy-900 mb-2 leading-snug">
                            <a href="/{{ lang }}/blog/{{ post.slug }}/" class="hover:text-coral transition-colors">{{ p.title | safe }}</a>
                        </h2>
                        <p class="text-sm text-gray-500 font-light line-clamp-3 mb-4">{{ p.excerpt | safe }}</p>
                        <a href="/{{ lang }}/blog/{{ post.slug }}/" class="inline-flex items-center text-sm font-medium text-coral hover:text-navy-900 transition-colors">
                            {{ t.blog.readMore | safe }} <svg class="svg-icon ml-2 text-xs"><use href="/assets/icons.svg#fa-arrow-right"></use></svg>
                        </a>
                    </div>
                </article>
                {%- endif %}
                {%- endfor %}
            </div>
            {%- else %}
            <div class="text-center py-16">
                <svg class="svg-icon text-5xl text-gray-300 mb-4"><use href="/assets/icons.svg#fa-newspaper"></use></svg>
                <p class="text-gray-400 text-lg">{{ t.blog.noPosts | safe }}</p>
            </div>
            {%- endif %}
        </div>
    </section>
{% endblock %}

{% block scripts %}
    <script src="/blog/blog.js"></script>
{% endblock %}
```

- [ ] **Step 3: Build and diff**

```bash
npm run build
diff -u /tmp/blog-index-baseline-ru.html _site/ru/blog/index.html
```

Expected differences: same class as Task 8 (nav gains Reviews/FAQ, desktop language switcher now sources names from `locales.js` instead of hardcoded "English"/"Русский"/"Тоҷикӣ" strings — same displayed text, different source, zero visible change; footer link/social fixes; skip-link added).

- [ ] **Step 4: Validate JSON-LD**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('_site/ru/blog/index.html', 'utf8');
const matches = [...html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];
if (matches.length !== 1) throw new Error('expected 1 Blog JSON-LD block, found ' + matches.length);
JSON.parse(matches[0][1]);
console.log('OK: blog index JSON-LD valid');
"
```

- [ ] **Step 5: Commit**

```bash
git add src/blog/index.njk
git commit -m "Migrate blog/index.njk to shared base layout"
```

---

### Task 10: Migrate `src/index.njk`

Hardest and highest-risk: most head content (2 large JSON-LD blocks), the inline glasses-animation IIFE, page-loader, hero preload — all must be transplanted without disturbing a single byte of the glasses-animation script, since that feature has broken from stale-cache issues before.

**Files:**
- Modify: `src/index.njk`

- [ ] **Step 1: Capture baseline**

```bash
npm run build
cp _site/ru/index.html /tmp/index-baseline-ru.html
cp _site/en/index.html /tmp/index-baseline-en.html
cp _site/tj/index.html /tmp/index-baseline-tj.html
```

- [ ] **Step 2: Rewrite `src/index.njk` front matter and head/nav/footer wiring**

Keep front matter (lines 1–9) unchanged. The full body content between `<main id="main-content">` and `</main>` (the page-loader div's sibling sections: hero, services, about, glasses animation, stats, testimonials, partners, vision disorders, vision test, FAQ, contact) is **not shown here in full** because it does not change at all — it is lifted verbatim into `{% block content %}...{% endblock %}` with zero edits. Copy it byte-for-byte from the current file between the old `<nav>...</nav>` close (line 347) and the old `</main><!-- /#main-content -->` (line 931) — **excluding** the `<nav>...</nav>` block itself, which the shared macro now renders.

The template becomes:

```
{%- set t = locales[lang].strings -%}
{%- set isHome = true -%}
{%- set navVariant = 'transparent' -%}
{%- set bodyClass = 'text-gray-800' -%}
{% extends "layouts/base.njk" %}

{% block pageTitle %}{{ t.meta.title }}{% endblock %}

{% block metaTags %}
    <meta name="description" content="{{ t.meta.description }}">
    <meta name="author" content="Dr. Sitora Karimova">

    <!-- Geo targeting -->
    <meta name="geo.region" content="TJ-DUS">
    <meta name="geo.placename" content="Dushanbe">
    <meta name="geo.position" content="38.571092;68.798550">

    <!-- Robots directives -->
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

    <!-- Canonical URL - Always points to the base URL without language parameter -->
    <link rel="canonical" href="https://sitorakarimi.com/{{ lang }}/">

    <!-- Hreflang tags for multilingual SEO -->
    {%- for code, loc in locales %}
    <link rel="alternate" hreflang="{{ loc.hreflang }}" href="https://sitorakarimi.com/{{ code }}/">
    {%- endfor %}
    <link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sitorakarimi.com/{{ lang }}/">
    <meta property="og:site_name" content="Dr. Sitora Karimova Ophthalmology">
    <meta property="og:title" content="{{ t.meta.ogTitle or t.meta.title }}">
    <meta property="og:description" content="{{ t.meta.description }}">
    <meta property="og:image" content="https://sitorakarimi.com/assets/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="{{ locales[lang].ogLocale }}">
    {%- for code, loc in locales %}
    {%- if code != lang %}
    <meta property="og:locale:alternate" content="{{ loc.ogLocale }}">
    {%- endif %}
    {%- endfor %}

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://sitorakarimi.com/{{ lang }}/">
    <meta property="twitter:title" content="{{ t.meta.ogTitle or t.meta.title }}">
    <meta property="twitter:description" content="{{ t.meta.description }}">
    <meta property="twitter:image" content="https://sitorakarimi.com/assets/images/og-image.jpg">
{% endblock %}

{% block stylesPreload %}
    <!-- Preload styles.css so it fetches immediately after HTML is received -->
    <link rel="preload" href="/styles.css?v={{ assets.css }}" as="style">
{% endblock %}

{% block tailwindStyles %}
    <!-- Tailwind CSS — inlined to eliminate render-blocking network request -->
    <style>{% inlineFile "tailwind.css" %}</style>
{% endblock %}

{% block schema %}
    <!-- Schema.org Structured Data - Enhanced with LocalBusiness and Reviews -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["MedicalBusiness", "Physician", "LocalBusiness"],
        "name": "Dr. Sitora Karimova - Ophthalmology Practice",
        "alternateName": "Sitora Karimova Ophthalmology",
        "image": [
            "https://sitorakarimi.com/assets/images/about-1.jpg",
            "https://sitorakarimi.com/assets/images/about-2.jpg",
            "https://sitorakarimi.com/assets/images/og-image.webp"
        ],
        "logo": "https://sitorakarimi.com/favicon.svg",
        "@id": "https://sitorakarimi.com",
        "url": "https://sitorakarimi.com",
        "telephone": "+992108118080",
        "email": "info@sitorakarimi.com",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Bekhzod Street 14",
            "addressLocality": "Dushanbe",
            "addressRegion": "Dushanbe",
            "postalCode": "734000",
            "addressCountry": "TJ"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "38.571092",
            "longitude": "68.798550"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "medicalSpecialty": ["Ophthalmology", "Optometry"],
        "inLanguage": "{{ locales[lang].htmlLang }}",
        {#- Localized so /ru/ and /tj/ carry schema in their own language, and
            free of the "board-certified" claim (see hasCredential below). -#}
        "description": {{ t.meta.schemaDescription | dump | safe }},
        "founder": {
            "@type": "Person",
            "name": "Dr. Sitora Karimova",
            "jobTitle": "Ophthalmologist",
            "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Avicenna Tajik State Medical University"
            },
            {#- Only verifiable credentials. This previously claimed a Board
                Certification "recognizedBy" the American Academy of
                Ophthalmology — the AAO does not board-certify anyone (that is
                the American Board of Ophthalmology), and an unverifiable
                credential on a YMYL medical site is a real liability. -#}
            "hasCredential": [
                {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "degree",
                    "name": "Diploma in Medicine",
                    "recognizedBy": {
                        "@type": "EducationalOrganization",
                        "name": "Avicenna Tajik State Medical University"
                    }
                }
            ],
            "knowsLanguage": ["ru", "tg", "en"]
        },
        {#- Generated from src/_data/services.js + the locale strings, so this
            catalog always lists exactly the services rendered as cards below.
            Google requires structured data to reflect visible page content;
            this previously advertised Dry Eye / Ongoing Care / Pediatric Eye
            Care while the page showed nine unrelated procedures. -#}
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": {{ t.services.title | dump | safe }},
            "itemListElement": [
                {%- for s in services %}
                {%- set sv = t.services[s.key] %}
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "MedicalProcedure",
                        "@id": "https://sitorakarimi.com/{{ lang }}/#{{ s.id }}",
                        "name": {{ sv.title | dump | safe }},
                        "description": {{ (sv.description or sv.intro) | striptags | dump | safe }}
                    }
                }{% if not loop.last %},{% endif %}
                {%- endfor %}
            ]
        },
        "containedInPlace": {
            "@type": "Store",
            "name": "Osse Optical Store",
            "description": "Optical store co-located with Dr. Karimova's practice — prescription glasses filled same-day",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bekhzod Street 14",
                "addressLocality": "Dushanbe",
                "addressRegion": "Dushanbe",
                "postalCode": "734000",
                "addressCountry": "TJ"
            }
        },
        "sameAs": [
            "https://www.facebook.com/sitorakarimi",
            "https://www.instagram.com/dr.sitora.karimova/",
            "https://www.linkedin.com/in/sitorakarimi"
        ]
    }
    </script>

    <!-- FAQ Schema (locale-aware) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": {{ t.faq.question1 | dump | safe }},
                "acceptedAnswer": { "@type": "Answer", "text": {{ t.faq.answer1 | dump | safe }} }
            },
            {
                "@type": "Question",
                "name": {{ t.faq.question2 | dump | safe }},
                "acceptedAnswer": { "@type": "Answer", "text": {{ t.faq.answer2 | dump | safe }} }
            },
            {
                "@type": "Question",
                "name": {{ t.faq.question3 | dump | safe }},
                "acceptedAnswer": { "@type": "Answer", "text": {{ t.faq.answer3 | dump | safe }} }
            },
            {
                "@type": "Question",
                "name": {{ t.faq.question4 | dump | safe }},
                "acceptedAnswer": { "@type": "Answer", "text": {{ t.faq.answer4 | dump | safe }} }
            },
            {
                "@type": "Question",
                "name": {{ t.faq.question5 | dump | safe }},
                "acceptedAnswer": { "@type": "Answer", "text": {{ t.faq.answer5 | dump | safe }} }
            },
            {
                "@type": "Question",
                "name": {{ t.faq.question6 | dump | safe }},
                "acceptedAnswer": { "@type": "Answer", "text": {{ t.faq.answer6 | dump | safe }} }
            }
        ]
    }
    </script>
{% endblock %}

{% block headExtra %}
    <!-- Preconnect to external origins -->
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">

    <!-- LCP hero image preload — mobile gets the smaller JPEG, desktop gets webp -->
    <link rel="preload" as="image"
          href="/assets/images/hero.webp"
          imagesrcset="/assets/images/hero-mobile.webp 800w, /assets/images/hero.webp 1248w"
          imagesizes="100vw"
          fetchpriority="high">
{% endblock %}

{% block gtmNoscript %}
    {% include "partials/gtm-noscript.njk" %}
{% endblock %}

{% block bodyStart %}
    <!-- Page Loader -->
    <div class="page-loader" id="page-loader">
        <div class="loader-icon"></div>
    </div>
{% endblock %}

{% block content %}
[[[ PASTE VERBATIM: current src/index.njk lines 349–930 (everything between the
    old </nav> close and the old </main> close) — hero, services, about,
    glasses animation + its data attributes, stats, testimonials, partners,
    vision disorders, vision test, FAQ, contact sections. Zero edits. ]]]
{% endblock %}

{% block scripts %}
    <script src="/script.js?v={{ assets.script }}" defer></script>
    <script src="/vision-test.js?v={{ assets.visionTest }}" defer></script>
    <script src="/vision-disorders.js?v={{ assets.visionDisorders }}" defer></script>
{% endblock %}

{% block bodyEndExtra %}
    {% include "partials/gtm-loader.njk" %}
{% endblock %}
```

The `[[[ PASTE VERBATIM ]]]` marker is an instruction to the implementer, not literal file content: open `src/index.njk` before this task's edits, copy lines 349–930 exactly (this range includes the inline glasses-animation `<script>` IIFE the CLAUDE.md "Debugging" section references by searching for `const LENS` — do not retype it, copy-paste to guarantee byte-fidelity), and paste between `{% block content %}` and `{% endblock %}` with no modification.

- [ ] **Step 3: Build and diff — this is the highest-stakes diff in the whole plan**

```bash
npm run build
diff -u /tmp/index-baseline-ru.html _site/ru/index.html
```

Expected differences ONLY: nav/footer bug fixes identical in kind to Tasks 7–9 (footer social links/LinkedIn/Privacy link/per-service anchors; skip-to-content added — index already had one, so this should show as unchanged, not added); `body class` unchanged (`text-gray-800`, no `data-lang`, confirm the `{% if not isHome %}` guard correctly suppressed `data-lang` on this page). If the glasses-animation `<script>` block, any section's markup, or any JSON-LD content differs by even one character, stop — that means the copy-paste in Step 2 was not exact.

Repeat for `en` and `tj`:

```bash
diff -u /tmp/index-baseline-en.html _site/en/index.html
diff -u /tmp/index-baseline-tj.html _site/tj/index.html
```

- [ ] **Step 4: Validate both JSON-LD blocks**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('_site/ru/index.html', 'utf8');
const matches = [...html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];
if (matches.length !== 2) throw new Error('expected LocalBusiness + FAQPage, found ' + matches.length);
matches.forEach(m => JSON.parse(m[1]));
console.log('OK: homepage JSON-LD valid,', matches.length, 'blocks');
"
```

- [ ] **Step 5: Confirm the glasses-animation IIFE is byte-identical**

```bash
node -e "
const fs = require('fs');
const extract = (html) => {
  const m = html.match(/const LENS[\s\S]*?\n    <\/script>/);
  if (!m) throw new Error('LENS script not found');
  return m[0];
};
const before = extract(fs.readFileSync('/tmp/index-baseline-ru.html', 'utf8'));
const after = extract(fs.readFileSync('_site/ru/index.html', 'utf8'));
if (before !== after) throw new Error('glasses animation script changed!');
console.log('OK: glasses animation script byte-identical');
"
```

- [ ] **Step 6: Manual browser check — the highest-risk regression surface**

```bash
npm run build
python3 -m http.server 8080 --directory _site &
```

Open `http://localhost:8080/ru/?glassesdebug` (verbose debug mode per CLAUDE.md's Glasses Animation section). Confirm: no `⚠ CSS NOT APPLIED` / `⚠ SVG NOT READY` / `⚠ NON-ZERO SCROLL` warnings; scrolling through the glasses section performs the zoom/lens-exit animation correctly; navbar goes solid past 100px scroll; mobile menu opens/closes; language switcher navigates correctly; vision test runs through all 12 lines; FAB button appears on scroll. Then:

```bash
kill %1
```

- [ ] **Step 7: Commit**

```bash
git add src/index.njk
git commit -m "$(cat <<'EOF'
Migrate index.njk to shared base layout

Highest-risk migration in this series — glasses animation script and all
section markup transplanted byte-for-byte (verified programmatically).
Nav/footer now render via the shared macros; homepage-specific head
content (JSON-LD, hero preload, inlined Tailwind, page loader) preserved
in base.njk's blocks exactly as before.
EOF
)"
```

---

### Task 11: Remove drifted `footer.*` service locale keys; final version bump

Now that no template reads `t.footer.eyeExams`/`glasses`/`contacts`/`dryeye`/`followup` (they were replaced by `services.<key>.title` in Task 5's footer macro), delete them — they are the 15 strings (5 keys × 3 locales) that had already drifted from the canonical `services.js` titles.

**Files:**
- Modify: `src/_data/locales/ru.json`
- Modify: `src/_data/locales/tj.json`
- Modify: `src/_data/locales/en.json`

- [ ] **Step 1: Confirm nothing still references the old keys**

```bash
grep -rn "footer\.eyeExams\|footer\.glasses\|footer\.contacts\|footer\.dryeye\|footer\.followup" src/
```

Expected: no matches (Tasks 7–10 already removed every template reference).

- [ ] **Step 2: Edit `src/_data/locales/en.json`**

Current (lines 191–206):
```json
  "footer": {
    "tagline": "Exceptional ophthalmology care since 2017",
    "servicesTitle": "Services",
    "eyeExams": "Comprehensive Eye Examinations",
    "glasses": "Prescription Glasses",
    "contacts": "Contact Lenses",
    "dryeye": "Dry Eye Management",
    "followup": "Ongoing Care and Follow-Up",
    "infoTitle": "Information",
    "about": "About",
    "reviews": "Reviews",
    "contact": "Contact",
    "privacy": "Privacy Policy",
    "connect": "Connect",
    "copyright": "© {year} Sitora Karimova Ophthalmology. All rights reserved."
  },
```

Replace with:
```json
  "footer": {
    "tagline": "Exceptional ophthalmology care since 2017",
    "servicesTitle": "Services",
    "infoTitle": "Information",
    "about": "About",
    "reviews": "Reviews",
    "contact": "Contact",
    "privacy": "Privacy Policy",
    "connect": "Connect",
    "copyright": "© {year} Sitora Karimova Ophthalmology. All rights reserved."
  },
```

- [ ] **Step 3: Edit `src/_data/locales/ru.json`** (same line range, same key removal — Cyrillic values, do not touch the surviving keys' text)

Current:
```json
  "footer": {
    "tagline": "Исключительный уход за глазами с 2017 года",
    "servicesTitle": "Услуги",
    "eyeExams": "Комплексное обследование глаз",
    "glasses": "Очки по рецепту",
    "contacts": "Контактные линзы",
    "dryeye": "Лечение сухости глаз",
    "followup": "Постоянный уход и наблюдение",
    "infoTitle": "Информация",
    "about": "О нас",
    "reviews": "Отзывы",
    "contact": "Контакты",
    "privacy": "Политика конфиденциальности",
    "connect": "Связаться",
    "copyright": "© {year} Офтальмология Ситоры Каримовой. Все права защищены."
  },
```

Replace with:
```json
  "footer": {
    "tagline": "Исключительный уход за глазами с 2017 года",
    "servicesTitle": "Услуги",
    "infoTitle": "Информация",
    "about": "О нас",
    "reviews": "Отзывы",
    "contact": "Контакты",
    "privacy": "Политика конфиденциальности",
    "connect": "Связаться",
    "copyright": "© {year} Офтальмология Ситоры Каримовой. Все права защищены."
  },
```

- [ ] **Step 4: Edit `src/_data/locales/tj.json`**

Current:
```json
  "footer": {
    "tagline": "Нигоҳубини истисноии чашм аз соли 2017",
    "servicesTitle": "Хидматҳо",
    "eyeExams": "Санҷишҳои комили чашм",
    "glasses": "Айнаки тиббӣ",
    "contacts": "Линзаҳои тамосӣ",
    "dryeye": "Табобати хушкии чашм",
    "followup": "Нигоҳубини доимӣ ва пайгирӣ",
    "infoTitle": "Маълумот",
    "about": "Дар бораи мо",
    "reviews": "Тақризҳо",
    "contact": "Тамос",
    "privacy": "Сиёсати махфият",
    "connect": "Пайваст",
    "copyright": "© {year} Офтальмологияи Ситора Каримова. Ҳамаи ҳуқуқҳо маҳфузанд."
  },
```

Replace with:
```json
  "footer": {
    "tagline": "Нигоҳубини истисноии чашм аз соли 2017",
    "servicesTitle": "Хидматҳо",
    "infoTitle": "Маълумот",
    "about": "Дар бораи мо",
    "reviews": "Тақризҳо",
    "contact": "Тамос",
    "privacy": "Сиёсати махфият",
    "connect": "Пайваст",
    "copyright": "© {year} Офтальмологияи Ситора Каримова. Ҳамаи ҳуқуқҳо маҳфузанд."
  },
```

(Confirm the exact `contact` value in your working copy — read the file before editing to get the byte-exact current string, since only the key removal should change, not the surviving translations.)

- [ ] **Step 5: Rebuild and confirm no missing-key errors**

```bash
npm run build 2>&1 | tee /tmp/build-log.txt
grep -i "undefined\|error" /tmp/build-log.txt || echo "clean build"
```

- [ ] **Step 6: Full-site version-string sanity check**

```bash
grep -rhoE '\?v=[0-9.]+' _site/ | sort | uniq -c
```

Expected: exactly one distinct version number per asset name (e.g. all `styles.css?v=` occurrences share one version, all `script.js?v=` occurrences share one version) — this is the check that used to require manual cross-referencing against `sw.js`; it should now trivially pass because there is only one source (`assets.js`) for every number.

- [ ] **Step 7: Full diff sweep across all locales and page types**

```bash
diff -rq /tmp/privacy-baseline-ru _site/ru/privacy 2>&1 | grep -v "^Only in" || true
diff -rq /tmp/blog-post-baseline-ru _site/ru/blog --exclude=index.html 2>&1 | grep -v "differ" | grep -v "^Only in" || true
diff -u /tmp/blog-index-baseline-ru.html _site/ru/blog/index.html > /tmp/diff-blog-index.txt; wc -l /tmp/diff-blog-index.txt
diff -u /tmp/index-baseline-ru.html _site/ru/index.html > /tmp/diff-index.txt; wc -l /tmp/diff-index.txt
```

Spot-check that `/tmp/diff-*.txt` contain only the changes already enumerated in Tasks 7–10's expected-differences lists — no surprises.

- [ ] **Step 8: Commit**

```bash
git add src/_data/locales/ru.json src/_data/locales/tj.json src/_data/locales/en.json
git commit -m "$(cat <<'EOF'
Remove drifted footer.* service locale keys (superseded by services.js)

footer.eyeExams/glasses/contacts/dryeye/followup duplicated
services.<key>.title under a separate key namespace and had already
drifted in wording (e.g. "Comprehensive Eye Examinations" vs the
canonical "Comprehensive Eye Examination"). The footer macro (added
earlier in this series) reads services.js directly; these are dead.
EOF
)"
```

---

### Task 12: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite the "Version Management & Releases (CRITICAL)" section**

Find the current section (starts `## Version Management & Releases (CRITICAL)`, ends right before `## Netlify Configuration`). Replace its entire body with:

```markdown
## Version Management & Releases (CRITICAL)

`sw.js` (generated from `src/sw.njk`) precaches assets cache-first; HTML is network-first. Stale-cache bugs are invisible locally and hit returning visitors — historically this broke the glasses animation (SW served a pre-animation `styles.css`).

**Every `?v=` version and the SW's `CACHE_VERSION` now come from one file: `src/_data/assets.js`.** There is nothing to cross-check by hand anymore — `src/sw.njk` and every template's `<head>`/`<script>` tags all read the same object, so a mismatch is no longer possible. Previously this required a manual `grep -rhoE '\?v=[0-9.]+' src/ sw.js | sort | uniq -c` before every deploy; that check is now redundant (each asset name appears with exactly one version by construction) but still useful as a sanity confirmation.

**Rules:**
- Edit `styles.css` → bump `assets.css` and `assets.cache` in `src/_data/assets.js`
- Edit `tailwind.config.js`/`tailwind.input.css` → bump `assets.tailwind` and `assets.cache`
- Edit any JS (`script.js`, `vision-test.js`, `vision-disorders.js`) → bump that file's entry in `assets.js` and `assets.cache`
- Edit `blog/blog.js` or `assets/icons.svg` (unversioned URLs, precached) → bump `assets.cache` only
- Edit `blog/blog.css` → bump `assets.blogCss` and `assets.cache`
- `npm run build` regenerates `_site/sw.js` from `src/sw.njk` automatically — there is no separate SW file to remember to edit

Current release: assets.js `cache` 1.7.0, `css`/`tailwind`/`blogCss` 1.6.0, `script` 1.2.1, `visionTest`/`visionDisorders` 1.1.0.
```

- [ ] **Step 2: Update the "File Structure" listing**

In the `File Structure` code block near the top of the file, make these changes:
- Change `sw.js                    Service worker (precache + runtime cache, versioned)` to `src/sw.njk               Service worker template — reads versions from src/_data/assets.js`
- Add a line under the `src/` tree (near `src/_data/`) for the new includes:
  ```
    _includes/               Shared layout + partials (layouts/base.njk, partials/nav.njk,
                              partials/footer.njk, partials/head-common.njk, partials/gtm-*.njk)
  ```

- [ ] **Step 3: Add a note to the "Services — one source of truth" section**

After the existing paragraph ending "...flagged for the owner.)", append:

```markdown

The footer's "Services" column also renders from this array (entries with `footer: true`) —
it used to be a fifth, independently-drifting set of `footer.eyeExams`/`footer.glasses`/…
locale strings; those are gone.
```

- [ ] **Step 4: Add a subsection documenting the shared layout, after "## Structured Data Rules" and before "## Canonical Facts"**

```markdown
## Shared Layout (nav/footer/head)

`src/_includes/layouts/base.njk` is the single skeleton every page (`index.njk`, `blog/index.njk`,
`blog/post.njk`, `privacy.njk`) extends. It owns the nav (`partials/nav.njk` macro), footer
(`partials/footer.njk` macro), universal `<head>` bits (`partials/head-common.njk`), the
`window.__T__`/`window.__LANG__` handoff, and the skip-to-content link. A page-specific `<title>`,
meta tags, Tailwind delivery, and JSON-LD live in that page's own `{% block %}` fills — see
`base.njk`'s header comment for the full list of blocks.

**To change a nav link or footer link:** edit `src/_data/nav.js` (nav) or flag/unflag a service with
`footer: true` in `src/_data/services.js` (footer services column) — never edit a template's markup
directly, or the four pages will drift again.

**hreflang blocks are intentionally NOT unified** — each page's `{% block metaTags %}` builds its
own, because the URL suffix differs per page type (`/{{code}}/`, `/{{code}}/blog/`,
`/{{code}}/blog/{{slug}}/`, `/{{code}}/privacy/`) and a blog post's hreflang must additionally
filter to locales it's actually translated into. Don't try to further-abstract this without a
real second use case.
```

- [ ] **Step 5: Build and confirm CLAUDE.md changes don't break anything (docs-only, but verify no stray broken markdown)**

```bash
npm run build
echo "build OK, CLAUDE.md is documentation-only"
```

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for the shared base layout and assets.js versioning"
```

---

### Task 13: Final full-site verification

**Files:** none (verification only)

- [ ] **Step 1: Clean rebuild**

```bash
npm run clean
npm run build
```

Expected: builds with no errors or warnings.

- [ ] **Step 2: Cross-check every page type × every locale has a working nav + footer**

```bash
for lang in ru tj en; do
  for page in "$lang/index.html" "$lang/blog/index.html" "$lang/privacy/index.html"; do
    f="_site/$page"
    echo "=== $f ==="
    grep -c 'nav-link-light' "$f"
    grep -c 'svg-icon.*fa-linkedin' "$f"
    grep -o 'href="/[a-z]*/privacy/"' "$f" | head -1
  done
done
```

Expected: every page shows 14 `nav-link-light` occurrences (7 desktop + 7 mobile), at least 1 LinkedIn icon, and a Privacy Policy href — confirming the unification landed everywhere.

- [ ] **Step 3: Version consistency final check**

```bash
grep -rhoE '\?v=[0-9.]+' _site/ | sort | uniq -c
```

Expected: one version per asset name, matching `src/_data/assets.js` exactly.

- [ ] **Step 4: JSON-LD validity across every page type**

```bash
node -e "
const fs = require('fs');
const glob = (dir, ext) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? glob(dir + '/' + e.name, ext) : (e.name.endsWith(ext) ? [dir + '/' + e.name] : [])
);
const files = glob('_site', '.html');
let total = 0, failed = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const matches = [...html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];
  for (const m of matches) {
    total++;
    try { JSON.parse(m[1]); } catch (e) { failed++; console.error('INVALID JSON-LD in', f, e.message); }
  }
}
console.log(total, 'JSON-LD blocks checked,', failed, 'invalid');
if (failed > 0) process.exit(1);
"
```

Expected: `N JSON-LD blocks checked, 0 invalid`.

- [ ] **Step 5: Manual browser pass (final)**

```bash
python3 -m http.server 8080 --directory _site &
```

Walk through, per CLAUDE.md's own verification habits:
- `/ru/` — glasses animation (`?glassesdebug`), vision test all 12 lines, testimonial carousel, mobile menu, language switcher, FAB button, SW update toast (bump `assets.cache` temporarily to `1.7.1`, rebuild, reload, confirm toast appears, then revert if this was just a test)
- `/ru/blog/` — post grid, language switcher
- `/ru/blog/<any-slug>/` — share buttons, related posts, CTA block, language switcher filtering
- `/ru/privacy/` — full footer now present, print preview (Cmd/Ctrl+P) still shows readable text (`.no-reveal` intact)

```bash
kill %1
```

- [ ] **Step 6: No commit for this task** (verification only — if issues are found, fix in the relevant earlier task's files and amend that task's commit or add a fixup commit, then re-run this task's checks)

---

## Self-Review Notes

**Spec coverage:** every decision in `docs/superpowers/specs/2026-07-17-header-footer-architecture-design.md` has a corresponding task — data layer (Task 1), sw.js→sw.njk (Task 2), partials (Tasks 3–5), base layout (Task 6), all 4 page migrations (Tasks 7–10), locale cleanup (Task 11), CLAUDE.md (Task 12), verification (Task 13). The CSP no-op finding is reflected in Global Constraints. The one approved visual change (privacy's full footer) is called out explicitly in Global Constraints and again in Task 7.

**Placeholder scan:** the only bracketed instruction-not-code marker is the `[[[ PASTE VERBATIM ]]]` block in Task 10 Step 2, which is deliberate and explained inline (copy-paste, not retype, to guarantee byte-fidelity for the glasses-animation script) — this is the one place in the plan where showing the literal 580 lines of unchanged existing markup would add bulk without adding information; the instruction is unambiguous about the exact line range and exact source file.

**Type/interface consistency:** `nav.njk`'s macro signature (`render(lang, variant, isHome, activeKey='', langSwitcherLinks=none)`) is used identically in Task 6 (`base.njk`) and matches the params every child template in Tasks 7–10 sets (`navVariant`, `navActive`, `langSwitcherLinks`). `footer.njk`'s `render(lang, isHome)` matches its one call site in `base.njk`. `assets.js` key names (`cache`, `css`, `tailwind`, `blogCss`, `script`, `visionTest`, `visionDisorders`) are used consistently across Tasks 2, 3, 6, 7, 8, 9, 10.
