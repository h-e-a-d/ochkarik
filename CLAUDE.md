# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multilingual (RU/TJ/EN) ophthalmologist website for Dr. Sitora Karimova (sitorakarimi.com), Dushanbe, Tajikistan. The practice is located inside the Osse Optical Store, Bekhzod Street 14. Minimalist design, scroll animations, an interactive vision test, a vision-disorders simulator, a scroll-driven glasses animation, and a trilingual blog.

Russian is the primary market/locale: the root URL redirects to `/ru/` (language-aware — see Netlify section) and `/ru/` is the `x-default` hreflang everywhere.

**Canonical contact phone: +992 108 11 80 80** (`tel:+992108118080`, WhatsApp `wa.me/992108118080`). Use this number in schema, links, and locale strings — do not reintroduce other numbers.

## Tech Stack

- **Static site generator**: Eleventy 3 (Nunjucks templates in `src/`, output in `_site/`)
- **CSS**: Tailwind CSS 3 compiled via CLI (`tailwind.input.css` → `tailwind.css`, **gitignored build artifact**) + hand-written `styles.css`
  - Homepage **inlines** the compiled Tailwind into a `<style>` tag (`{% inlineFile "tailwind.css" %}` shortcode) to avoid a render-blocking request; blog pages link it as `/tailwind.css?v=…`
- **JS**: Vanilla, no framework. `script.js` (homepage), `vision-test.js`, `vision-disorders.js`, `blog/blog.js`, plus a large inline IIFE in `src/index.njk` for the glasses animation
- **Icons**: Self-hosted SVG sprite `assets/icons.svg` (37 symbols from Font Awesome Free 6.4.0, CC BY 4.0). **No Font Awesome CDN, no icon webfonts.** See Icons section.
- **Fonts**: **Self-hosted Montserrat** (`assets/fonts/montserrat-*.woff2`, `@font-face` at the top of `styles.css`). **No Google Fonts, no font CDN.** See Typography.
- **Hosting**: Netlify (`_headers` for CSP/security headers, `_redirects` for the language-aware root redirect)
- **Analytics**: Google Tag Manager (GTM-TBKDQH2B), idle-deferred so it doesn't block LCP
- **Offline/caching**: hand-rolled service worker `sw.js` (see Version Management — critical)

## Architecture

### File Structure

```
.eleventy.js              Eleventy config: inlineFile shortcode + passthrough copies
src/
  index.njk               Homepage template (paginated over locales → /ru/, /tj/, /en/)
                          Contains: full <head> with JSON-LD schemas, all sections,
                          and the inline glasses-animation IIFE before </body>
  sitemap.njk             sitemap.xml with hreflang alternates for all pages
  blog/index.njk          Blog listing template (per locale)
  blog/post.njk           Blog post template (locale × post via blogPages)
  _data/locales.js        Locale registry (ru/tj/en; Tajik is `tg` in BCP-47, `/tj/` in URLs)
  _data/locales/*.json    ALL UI strings per language (nav, hero, faq, swUpdate, …)
  _data/blogPosts.js      Blog post loader
  _data/blogPages.js      Locale × post page generator
  _data/blog/posts/*.json One JSON per article, all languages inside
script.js                 Homepage interactivity (see feature list below)
vision-test.js            Interactive Snellen vision test (modular IIFE)
vision-disorders.js       Vision disorders simulator (tabs + severity slider)
blog/blog.css, blog/blog.js   Blog static assets (menu, share buttons, markdown render)
styles.css                Custom CSS: buttons, animations, vision test, FAB, glasses anim, SW toast
tailwind.input.css        Tailwind entry point (config: tailwind.config.js)
sw.js                     Service worker (precache + runtime cache, versioned)
assets/icons.svg          SVG icon sprite (generated — do not hand-edit)
scripts/build-icon-sprite.mjs  Regenerates assets/icons.svg
assets/images/            Self-hosted images (webp + og-image.jpg); table-ru.svg Snellen chart
_headers                  Netlify security headers incl. CSP
_redirects                Language-aware root redirect
blog.md                   Comprehensive blog system documentation and content workflow
docs/superpowers/plans/   Implementation plans (checkbox progress tracking)
```

There is **no root `index.html`** — the homepage source of truth is `src/index.njk`. Never edit files in `_site/` (build output, gitignored).

### Build & Development

```bash
npm run dev     # tailwind --watch + eleventy --serve
npm run build   # tailwind --minify + eleventy  → _site/
npm run clean   # rm -rf _site tailwind.css
```

Preview a build: `python3 -m http.server 8080 --directory _site` → http://localhost:8080/ru/

Verification habits (no test suite): after template/CSS changes run `npm run build` and grep `_site/` output; after JS changes run `node --check <file>`.

### Internationalization

- One page per locale: `/ru/`, `/tj/`, `/en/` (+ `/{lang}/blog/...`). Content is rendered **server-side by Eleventy** from `src/_data/locales/*.json`.
- `data-i18n="key.path"` attributes exist on translated elements; `window.__T__` (the locale's full string object) and `window.__LANG__` are injected into every page for JS that needs strings (FAB labels, vision test, SW toast).
- The language switcher just **navigates** to the same path under the other locale prefix (`script.js` "Language Switcher" section) — no client-side re-rendering.
- Adding a string: add the key to **all three** locale JSONs, reference it via `{{ t.path | safe }}` in templates.
- hreflang: every page lists ru/tg/en alternates + `x-default` → **`/ru/`** (homepage head, blog templates, sitemap.njk — keep all four in sync).

### Design System

**Colors** (Tailwind config + styles.css): Navy 900 `#0a2a3d` (primary dark), Navy 800 `#0f3d56` (hover), Coral `#ff6b4a` (accent), white/grays.

**Typography**: **self-hosted Montserrat**, set on `body` in `styles.css` and as Tailwind's `sans` (Preflight applies it to `<html>`); default weight 300. Blog and privacy inherit the same rule — do not add font CDNs.

- One **variable** woff2 per script subset spans weights 300–700; `unicode-range` means a browser downloads only what the page renders (`en` → latin ~37 KB; `ru` → cyrillic + latin; `tg` → cyrillic + cyrillic-ext + latin). Templates preload only their own locale's subsets.
- **Do not switch fonts without checking Cyrillic + Tajik coverage first.** Poppins (used until 2026-07-17) ships only latin/latin-ext/devanagari — **no Cyrillic at all** — so `ru`/`tg`, the primary audience, silently fell back to a system font while still paying for the download. The stack also listed `'Söhne'` first, a commercial font that was never served. Montserrat covers Latin + Cyrillic + every Tajik letter (ғ ӣ қ ӯ ҳ ҷ), verified against its cmap. Manrope/Onest/Jost fail Tajik; Rubik lacks Ҳ/ҳ.
- Fonts are precached by the SW and served `immutable` for a year (`_headers`); the filenames carry no hash, so a **replacement typeface must ship under a new filename**.

**Buttons** (styles.css): `.btn-navy` (solid, light backgrounds), `.btn-green` (vision-test Yes), `.btn-outline` (navy outline), `.btn-white` (**primary on dark**), `.btn-outline-white` (**secondary on dark**). All have hover lift.

> On a navy surface use `.btn-white` + `.btn-outline-white`. Never `.btn-navy` there — it is `#0a2a3d` on `#0a2a3d`, invisible, and cedes hierarchy to the outline button next to it.

### Icons (SVG sprite)

All icons come from `assets/icons.svg`, referenced as:

```html
<svg class="svg-icon text-xl" aria-hidden="true"><use href="/assets/icons.svg#fa-star"></use></svg>
```

- `.svg-icon` (styles.css) is `1em × 1em`, `fill: currentColor` — size with text-size utilities, color with text-color utilities, exactly like the old Font Awesome classes.
- **To add an icon**: append `["fa-name", "solid|regular|brands/fa6-file-name"]` to the `ICONS` array in `scripts/build-icon-sprite.mjs`, run `node scripts/build-icon-sprite.mjs`, commit the regenerated sprite.
- Renamed ids to know: `fa-xmark` (not fa-times), `fa-regular-clock`/`fa-regular-calendar` (regular style), `fa-telegram`, `fa-user-md` (sourced from FA's user-doctor).
- **Never hand-edit `assets/icons.svg`** — the build script rewrites it from scratch and your symbol disappears on the next run.
- **Dynamic icon swaps** change the `<use>` href, not classes — e.g. mobile menu toggle (`script.js`, `blog/blog.js`) swaps `#fa-bars` ↔ `#fa-xmark`; blog copy-link swaps `#fa-link` → `#fa-check`.
- The sprite is in the SW precache; sprite changes need a `CACHE_VERSION` bump.

### Homepage Sections (src/index.njk, in order)

1. **Navigation** — fixed navbar, transparent until `.scrolled` (100px), mobile menu + language switcher
2. **Hero** (`#home`) — full-screen, `<picture>` with `hero-mobile.webp`/`hero.webp` (preloaded, fetchpriority=high), gradient overlay
3. **Services** (`#services`) — 6 cards on navy, expandable descriptions (`.service-toggle`)
4. **About** (`#about`) — text + 2-image carousel
5. **Glasses animation** (`#glasses-animation-section`) — see dedicated section below
6. **Stats** — "8+ Years" counter circle (animates on scroll into view)
7. **Testimonials** (`#testimonials`) — 4-slide carousel, quote + 5 stars each (visible HTML only — **no review/aggregateRating JSON-LD; Google treats self-hosted review markup as self-serving spam, do not re-add**)
8. **Partners** (`#partners`) — icon grid + Google Maps link
9. **Vision disorders** (`#vision-disorders`) — healthy/myopia/cataracts/glaucoma tabs + severity slider over `vision-disorders.webp` (logic: vision-disorders.js)
10. **Vision test** (`#vision-test`) — see dedicated section below
11. **FAQ** (`#faq`) — 6 static Q&A cards (mirrored in FAQPage JSON-LD, locale-aware)
12. **Contact** (`#contact`) — Google Maps embed (real clinic location), phone/email/hours, WhatsApp booking + call buttons
13. **Footer** — links + social icons

`<head>` JSON-LD blocks: MedicalBusiness/Physician/LocalBusiness (NO reviews), FAQPage (locale-aware), ItemList of MedicalProcedures.

### script.js Features (section comments in file)

Page loader · Language switcher (URL navigation) · Mobile menu + backdrop (sprite href swap) · Smooth scrolling with navbar offset · Active-nav-on-scroll · Consolidated RAF-throttled scroll handler · IntersectionObserver scroll animations · Stats counter · Image lazy loading · Hero text animation · Keyboard accessibility (Esc closes menu, Tab detection) · Smooth reveal · Footer year · Testimonial carousel · About carousel · Service row expand/toggle · Contact FAB (floating phone/WhatsApp button, created dynamically) · Service worker registration + **update toast**.

Scroll-handler rule: guard every `classList.add/remove` with a `.contains()` check (navbar `.scrolled`, FAB `.fab-visible`) — unconditional mutations restart CSS transitions every scroll frame in Chromium.

SW update toast: when a new SW version installs, `showUpdateToast()` shows a localized "site updated / refresh" pill (`.sw-update-toast` in styles.css, strings under `swUpdate` in locale JSONs). No silent console.log. Note: only homepage loads `script.js`, so SW registration/toast happens on homepage visits (blog pages load `blog/blog.js` instead).

## Services — one source of truth

**`src/_data/services.js` is the canonical service list.** `src/index.njk` renders both the
visible cards **and** the LocalBusiness `hasOfferCatalog` schema from that one array, so they
cannot drift. To add a service: add an entry there **and** `services.<key>.{title,description}`
to all three locale files. Nothing else. Card `id`s are the footer's deep-link targets
(`#service-dry-eye`) and the schema `@id`s.

This exists because three lists had already drifted: 9 visible cards, 6 footer links, and 6
schema entries advertising "Dry Eye Management", "Ongoing Care" and "Pediatric Eye Care" that
had no card anywhere — structured data not representing visible content, which is a Google
rich-results violation. **Children's/pediatric eye care is not offered** and must not reappear
in the schema or footer. (Note the blog still carries pediatric content and a `pediatric`
category — a known content/services mismatch, flagged for the owner.)

## Structured Data Rules

- Inject text into `<script type="application/ld+json">` with `{{ value | dump | safe }}`,
  never as `"{{ value }}"` — one double quote in a title breaks the whole block, and Nunjucks
  autoescape would emit `&quot;`, which is not valid JSON either.
- Schema is **localized** — descriptions/service names come from the locale JSON so `/ru/`
  carries Russian schema. Don't hardcode English into a JSON-LD block.
- **Anything claimed in schema must be visible on the page.**
- **No `review`/`aggregateRating`** on LocalBusiness: Google disallows self-serving reviews —
  no stars, and a manual-action risk. Ratings must come from the Google Business Profile.
- Credentials must be verifiable. Do not reintroduce "Board Certified" / "Fellow, American
  Academy of Ophthalmology" — the AAO does not board-certify (that's the American Board of
  Ophthalmology), and this is a YMYL medical site.

## Canonical Facts

- **Phone: `+992 108 11 80 80`** → `tel:+992108118080`, `wa.me/992108118080`, schema
  `telephone`. One number everywhere; NAP consistency is load-bearing for local SEO.
- **`x-default` hreflang → `/ru/`** everywhere (homepage, blog, privacy, sitemap).
- **Sitemap `<lastmod>` must never be the build date.** Posts use their own `date`; other pages
  get real git commit dates via `src/_data/lastmod.js`, and the tag is omitted when git can't
  say. Stamping build time makes every deploy claim every page changed, which teaches Google to
  ignore `lastmod` sitewide — including where it's accurate.
- **Footer copyright year is dynamic** via `site.buildYear` + the `{year}` placeholder in
  `footer.copyright`. Never hardcode a year back into the locale strings.

## Scroll-reveal opt-out

`script.js` sets `opacity:0` on `section:not(.no-reveal) h2, section:not(.no-reveal) p` and
clears it via IntersectionObserver on scroll. **Add `.no-reveal` to any section whose text must
be readable without scrolling** — anything below the fold is `opacity:0` at print time and
prints blank. The privacy policy uses this; marketing sections intentionally do not.

## Version Management & Releases (CRITICAL)

`sw.js` precaches assets cache-first; HTML is network-first. Stale-cache bugs are invisible locally and hit returning visitors — historically this broke the glasses animation (SW served a pre-animation `styles.css`). The defense is **versioned URLs that must stay in sync**:

| Constant in sw.js | Must match `?v=` on | Where |
|---|---|---|
| `CSS_VERSION` | `/styles.css?v=…` | src/index.njk (preload + stylesheet), both blog templates |
| `TAILWIND_VERSION` | `/tailwind.css?v=…` | both blog templates |
| `CACHE_VERSION` | — (cache name) | bump on ANY asset change; purges all SW caches for all users |
| (literal in ASSETS_TO_CACHE) | `/script.js?v=…`, `/vision-test.js?v=…`, `/vision-disorders.js?v=…` | src/index.njk script tags |

**Rules:**
- Edit `styles.css` → bump `CSS_VERSION` + all `?v=` on styles.css links + `CACHE_VERSION`
- Edit `tailwind.config.js`/`tailwind.input.css` → bump `TAILWIND_VERSION` + blog `?v=` + `CACHE_VERSION`
- Edit any JS → bump its `?v=` in src/index.njk AND the matching entry in `ASSETS_TO_CACHE`, + `CACHE_VERSION`
- Edit `blog/blog.js` or `assets/icons.svg` (unversioned URLs, precached) → bump `CACHE_VERSION`
- **The `?v=` strings in `ASSETS_TO_CACHE` must equal the ones in HTML exactly** — SW cache matching includes the query string; a mismatch silently turns precache entries into dead weight
- Before deploy, cross-check: `grep -rhoE '\?v=[0-9.]+' src/ sw.js | sort | uniq -c`

Current release: 1.6.0 (CACHE/CSS/TAILWIND), script.js 1.2.1, vision-test.js/vision-disorders.js 1.1.0.
Note `/blog/blog.css?v=…` is versioned too and must match between the blog/privacy templates and `ASSETS_TO_CACHE`.

## Netlify Configuration

- **`_redirects`** — language-aware root redirect (Accept-Language at the edge): `Language=en` → `/en/`, `Language=tg` → `/tj/`, fallback `/ru/`. Only testable after deploy (`curl -H "Accept-Language: en" -I https://sitorakarimi.com/`).
- **`_headers`** — CSP allows only: self, GTM/GA scripts, Google Maps iframe. `style-src`/`font-src` are `'self'` (+inline styles). **All CSS/fonts/icons/images are self-hosted — adding any CDN resource requires a CSP update, prefer self-hosting instead.** Plus X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy.
- OG image is **JPEG** (`assets/images/og-image.jpg`, 1200×630) because WhatsApp renders WebP previews unreliably — don't switch og:image back to webp. (Blog posts still use per-post webp heroes for og:image.)

---

## Glasses Animation Section

Scroll-driven fullscreen animation between About and Stats: zooms into a pair of glasses, revealing sharp text through the lenses against blurry text. Vanilla JS + CSS, no library.

### Files

- **HTML**: `src/index.njk` — the `#glasses-animation-section` block, plus an inline `<script>` IIFE near the end of `<body>` (search for `const LENS`)
- **CSS**: `styles.css` — `.glasses-anim-*` rules
- **Asset**: `assets/images/eyeglasses-vector-small.svg`

### Structure

```
#glasses-animation-section
  └── .glasses-anim-stage  (height: 500vh — the scroll budget)
        └── .glasses-anim-sticky  (position: sticky, 100vh)
              ├── #glasses-anim-blurry            z2  full-screen blurry text
              ├── #glasses-mask-left / -right     z3  white masks, CSS clip-path ellipse per lens
              ├── #glasses-anim-sharp-left/-right z4  sharp text, CSS clip-path ellipse per lens
              └── .glasses-anim-wrap              z10 glasses image (transform target)
```

Note: clipping uses **CSS `clip-path: ellipse()`** on per-lens divs (cheap basic-shape clip in Chromium), NOT SVG `<clipPath>` — an earlier SVG-based approach was replaced for performance.

### Scroll phases (progress = how far through the 500vh stage)

| Phase | Progress | What happens |
|---|---|---|
| Zoom in | 0 → 0.68 | glasses scale 0.5 → 2.6, text fades in (blur 20px → 6px) |
| Exit through lens | 0.68 → 1.0 | scale → 18, pivot shifts to left lens, right lens shrinks to zero |

### LENS constants (fractions of the image bounding box)

```javascript
const LENS = {
  left:  { cx: 0.2775, cy: 0.2998, rx: 0.1646, ry: 0.2647 },
  right: { cx: 0.7205, cy: 0.2986, rx: 0.1644, ry: 0.2631 },
};
```
Re-measure if the glasses image is replaced. Clip ellipses are computed **analytically** from the transform `(tx, ty, s)` — never `getBoundingClientRect()` after writing the transform (layout thrash).

### Performance rules

- Read all layout values first, then write all DOM changes — never interleave
- RAF-throttle scroll (`ticking` flag, max one `requestAnimationFrame(update)` per frame)
- `will-change` pre-promotes layers; `isolation: isolate` on the sticky container
- Updates are skipped while the section is off-screen

### Debugging

- Enable verbose mode: append `?glassesdebug` to the URL, or `localStorage.glassesDebug='1'; location.reload()`
- Always-on warnings: `⚠ CSS NOT APPLIED` (stale SW cache — check CSS_VERSION/`?v=` were bumped), `⚠ SVG NOT READY` (auto-recovers on img.load), `⚠ NON-ZERO SCROLL`

### Disabling

Delete/comment the `#glasses-animation-section` block and the inline IIFE in `src/index.njk`. The `.glasses-anim-*` CSS can stay (inert without the HTML).

---

## Vision Test Feature

Interactive Snellen test (`#vision-test` section + `vision-test.js`), 12 lines of Russian Cyrillic optotypes (Ш Б М Н К Ы И), V = 0.1 → 2.0.

### Flow

1. **Initial**: instruction ("sit 50cm away, cover one eye") + Start button; chart hidden
2. **Active**: one line of characters centered in the white box; "LINE n OF 12" top-left, "V = 0,n" top-right; Yes (green) / No (outline) / Restart buttons. Both Yes and No advance — the test always runs all 12 lines
3. **Complete**: results summary (best vision = last "Yes" line; "Below V = 0,1" if none), scrollable ✓/✗ table, consultation reminder, only Restart visible

### Config (`VISION_TEST_CONFIG` in vision-test.js)

`totalLines: 12`; font sizes 120, 80, 60, 48, 40, 32, 28, 24, 20, 18, 14, 12 px; vision values V=0,1…1,0 then 1,5 and 2,0 with matching diopter values; `lineCharacters` arrays per line.

### Architecture

IIFE exposing `window.VisionTest` (`init()`, `isActive()`, `getCurrentLine()`). Key functions: `initVisionTest` (wires buttons; warns if section missing), `startTest`, `recordAnswer(canRead)`, `resetTest`, `updateTestDisplay`, `updateChartDisplay(line)`, `showCompletionMessage`. UI strings come from the locale JSONs (`visionTest.*` keys) via `window.__T__`.

Styles: dedicated section of `styles.css` (`.vision-test-container`, `.vision-chart-container`, indicators, results table, mobile breakpoints at 768px).

### Disabling

Remove the `#vision-test` section from `src/index.njk` or the `vision-test.js` script tag. Asset: `assets/images/table-ru.svg`.

**Medical disclaimer is mandatory and always visible**: "This test is for educational purposes only and does not replace a professional eye examination." No personal data is collected; everything runs client-side.

---

## Blog

Trilingual blog at `/{lang}/blog/`. **Full documentation and the content-creation workflow live in `blog.md`** — read it before blog work. Quick facts:

- Posts are single JSON files in `src/_data/blog/posts/` (one file = one article, all three languages inside, `aiTranslated` flags supported)
- Templates: `src/blog/index.njk` (listing), `src/blog/post.njk` (article; Article JSON-LD, per-locale hreflang, og:image from `post.image`)
- The `blog-post` skill automates: article discovery (RSS), rewriting, RU/TJ translation, hero image, build, SW bump, commit
- Blog pages load `tailwind.css?v=` + `styles.css?v=` + `blog/blog.css` and `blog/blog.js` (not script.js)

## SEO Checklist (maintained state — don't regress)

- hreflang ru/tg/en + x-default=/ru/ on every page and in sitemap.xml
- Canonical URLs per locale page
- og:image = JPEG for the homepage (WhatsApp compatibility)
- No self-serving review/aggregateRating structured data
- robots.txt is minimal (allow all + sitemap); sitemap.njk auto-includes blog posts with hreflang alternates
- One phone number everywhere: +992 108 11 80 80
- Schema `hasOfferCatalog` is generated from `src/_data/services.js` and must always equal the visible cards
- No unverifiable credentials in schema or on-page (see Structured Data Rules)
- BreadcrumbList on blog posts + privacy; Article carries publisher.logo, articleSection, keywords, dateModified
- Blog posts must keep contextual links into the site (end-of-post CTA + related posts) — they were a crawl dead-end before
- sitemap `<lastmod>` never uses the build date (see Canonical Facts)
- Privacy policy at /{lang}/privacy/, linked from the footer and in the sitemap

## Accessibility

- Skip-to-content link; semantic headings (one h1 in hero, h2 per section)
- `aria-expanded` on menu/FAB toggles, `aria-label` on icon-only buttons, `aria-hidden` on decorative icons, `role="status"` on the SW toast, `aria-live` on the testimonial carousel
- Esc closes the mobile menu; reduced-motion and high-contrast media queries in styles.css
