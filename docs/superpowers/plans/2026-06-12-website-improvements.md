# Website Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Execution protocol for this plan (user-mandated):** execute inline, STOP after each task, report what was done, and ask the user before continuing to the next task.

**Goal:** Fix correctness/consistency bugs (phone number, hreflang, SW cache URLs), remove dead code and external dependencies (Unsplash, Font Awesome CDN, Google Fonts), tighten SEO and CSP, and refresh stale docs on the sitorakarimi.com Eleventy site.

**Architecture:** All changes are static-site edits: Nunjucks templates in `src/`, vanilla JS at repo root, `styles.css`, Netlify `_headers`/`_redirects`, and the hand-rolled service worker `sw.js`. No new build tooling. Font Awesome is replaced by a self-hosted SVG sprite referenced via `<svg><use>`. Versioning policy from CLAUDE.md applies: a single final bump of `CACHE_VERSION`/`CSS_VERSION`/`TAILWIND_VERSION` + `?v=` query strings before deploy.

**Tech Stack:** Eleventy 3 (Nunjucks), Tailwind CSS 3 (compiled, inlined on homepage), vanilla JS, Netlify hosting.

**Decisions already made by the user:**
- Canonical phone everywhere: **+992 108 11 80 80** (`tel:+992108118080`, `wa.me/992108118080`)
- x-default hreflang: **/ru/** everywhere
- Typography: **system font stack everywhere** (drop Poppins from blog + Tailwind config)
- In scope: Font Awesome → inline SVGs, language-aware root redirect, SW update toast, CLAUDE.md refresh

**Verification baseline:** `npm run build` must succeed after every task that touches templates/CSS. There is no test suite; verification is build + grep on `_site/` output.

**Commit policy:** one commit per task, on `main` (matches repo history). Commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Unify phone number on +992 108 11 80 80

**Files:**
- Modify: `src/index.njk:107` (JSON-LD telephone)
- Modify: `src/index.njk:1182` (Book Now wa.me link)

- [x] **Step 1: Fix schema telephone**

In `src/index.njk` replace:
```
"telephone": "+992930097171",
```
with:
```
"telephone": "+992108118080",
```

- [x] **Step 2: Fix Book Now WhatsApp link**

Replace:
```
<a href="https://wa.me/992930097171" target="_blank" rel="noopener noreferrer" class="btn-navy" data-i18n="contact.bookNow">
```
with:
```
<a href="https://wa.me/992108118080" target="_blank" rel="noopener noreferrer" class="btn-navy" data-i18n="contact.bookNow">
```

- [x] **Step 3: Verify no old number remains in source**

Run: `grep -rn "992930097171\|93 009" src/ script.js blog/ vision-test.js vision-disorders.js`
Expected: no matches.

- [x] **Step 4: Build and verify output**

Run: `npm run build && grep -c "992108118080" _site/ru/index.html && grep -c "992930097171" _site/ru/index.html`
Expected: build succeeds; first grep ≥ 2; second grep returns 0 matches (exit 1).

- [x] **Step 5: Commit** — `75e498a`

```bash
git add src/index.njk
git commit -m "fix: unify phone number on +992 108 11 80 80 in schema and booking link"
```

---

### Task 2: Single x-default hreflang → /ru/

**Files:**
- Modify: `src/index.njk:37`
- Modify: `src/sitemap.njk` (3 x-default lines)

(`src/blog/post.njk` already uses /ru/ — no change. `src/_includes/layout.njk` is deleted in Task 3.)

- [x] **Step 1: Homepage**

In `src/index.njk` replace:
```
<link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/en/">
```
with:
```
<link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/">
```

- [x] **Step 2: Sitemap (3 occurrences)**

In `src/sitemap.njk` replace each:
```
<xhtml:link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/en/"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/en/blog/"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/en/blog/{{ post.slug }}/"/>
```
with the `/ru/` equivalents:
```
<xhtml:link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/blog/"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/blog/{{ post.slug }}/"/>
```

- [x] **Step 3: Build and verify**

Run: `npm run build && grep -rn 'x-default" href="https://sitorakarimi.com/en' _site/ | head`
Expected: no matches.

- [x] **Step 4: Commit** — `7381e42`

```bash
git add src/index.njk src/sitemap.njk
git commit -m "fix: use /ru/ as the single x-default hreflang everywhere"
```

---

### Task 3: Remove dead code

**Files:**
- Delete: `glasses-anim.js` (inline IIFE in index.njk is the live copy)
- Delete: `assets/images/hero.png` (1.2 MB, unreferenced)
- Delete: `src/_includes/layout.njk` (used by no template)
- Modify: `.eleventy.js` (remove glasses-anim passthrough)
- Modify: `src/index.njk:1266-1269` (remove dead SITE_VERSION script)

- [x] **Step 1: Confirm nothing references the files (safety check)**

Run: `grep -rn "glasses-anim.js\|hero.png\|layout.njk\|SITE_VERSION" src/ script.js blog/ .eleventy.js sw.js | grep -v "_site"`
Expected: only `.eleventy.js` passthrough line for glasses-anim.js and the `SITE_VERSION` inline script in index.njk.

- [x] **Step 2: Delete files**

```bash
git rm glasses-anim.js assets/images/hero.png src/_includes/layout.njk
```

- [x] **Step 3: Remove passthrough from `.eleventy.js`**

Delete the line:
```js
  eleventyConfig.addPassthroughCopy({ "glasses-anim.js": "glasses-anim.js" });
```

- [x] **Step 4: Remove dead SITE_VERSION script from `src/index.njk`**

Delete:
```html
    <script>
        // Auto-generate version from timestamp (changes every deployment)
        window.SITE_VERSION = '1.3.0'; // Must match CACHE_VERSION in sw.js
    </script>
```

- [x] **Step 5: Build and verify**

Run: `npm run build && ls _site/glasses-anim.js _site/assets/images/hero.png 2>&1`
Expected: build succeeds; both `ls` targets report "No such file or directory". Homepage still contains the inline glasses IIFE: verified via `glasses-anim-stage` (2) and `const LENS` (1) — note: `glasses-clip-left` no longer exists; implementation uses CSS clip-path now (CLAUDE.md staleness, covered in Task 16).

- [x] **Step 6: Commit** — `d83b8cb`

```bash
git add -A
git commit -m "chore: remove dead code (glasses-anim.js, hero.png, layout.njk, SITE_VERSION)"
```

---

### Task 4: Align service-worker precache URLs with versioned requests

**Files:**
- Modify: `sw.js:22-45` (`ASSETS_TO_CACHE`)
- Modify: `src/blog/post.njk:103` and `src/blog/index.njk` (`/styles.css` → versioned)

- [x] **Step 1: Version the JS entries in `ASSETS_TO_CACHE`**

In `sw.js` replace:
```js
    '/script.js',
    '/vision-test.js',
    '/vision-disorders.js',
```
with (versions must match the `?v=` used in `src/index.njk` script tags at the time of the final bump task; current values):
```js
    '/script.js?v=1.1.1',
    '/vision-test.js?v=1.1.0',
    '/vision-disorders.js?v=1.1.0',
```
Also add the tailwind stylesheet used by blog pages (version matches `TAILWIND_VERSION`):
```js
    `/tailwind.css?v=${TAILWIND_VERSION}`,
```

- [x] **Step 2: Version styles.css on blog templates**

In `src/blog/post.njk` and `src/blog/index.njk` replace:
```html
<link rel="stylesheet" href="/styles.css">
```
with:
```html
<!-- Version matches CSS_VERSION in sw.js — update both when styles.css changes -->
<link rel="stylesheet" href="/styles.css?v=1.3.2">
```

- [x] **Step 3: Build and verify**

Run: `npm run build && grep -n "styles.css" _site/ru/blog/index.html | head -3`
Expected: `/styles.css?v=1.3.2`.

- [x] **Step 4: Commit** — `d164b66`

```bash
git add sw.js src/blog/post.njk src/blog/index.njk
git commit -m "fix(sw): precache versioned JS URLs and version styles.css on blog pages"
```

---

### Task 5: Remove self-serving review schema

**Files:**
- Modify: `src/index.njk:206-270` (`aggregateRating` + `review` blocks in LocalBusiness JSON-LD)

- [x] **Step 1: Delete the `aggregateRating` object and the entire `review` array** from the LocalBusiness schema (keep `containedInPlace` and `sameAs`, fix trailing comma so JSON stays valid). The visible HTML testimonials section is untouched.

- [x] **Step 2: Validate JSON**

Run: `npm run build && python3 -c "
import json,re,sys
html=open('_site/ru/index.html').read()
for m in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S):
    json.loads(m)
print('all JSON-LD valid')"`
Expected: `all JSON-LD valid`, and `grep -c "aggregateRating" _site/ru/index.html` returns 0 (exit 1).

- [x] **Step 3: Commit** — `66b6671`

```bash
git add src/index.njk
git commit -m "fix(seo): remove self-serving review/aggregateRating schema"
```

---

### Task 6: JPEG Open Graph image

**Files:**
- Create: `assets/images/og-image.jpg` (converted from webp)
- Modify: `src/index.njk:45,60` (og:image + twitter:image)

- [x] **Step 1: Convert** — 1200×630, 153 KB

Run: `sips -s format jpeg -s formatOptions 85 assets/images/og-image.webp --out assets/images/og-image.jpg && sips -g pixelWidth -g pixelHeight assets/images/og-image.jpg`
Expected: file created; dimensions 1200×630 (if different, update the `og:image:width/height` meta to match).

- [x] **Step 2: Point homepage OG/Twitter meta at the JPG**

Replace both occurrences of:
```
https://sitorakarimi.com/assets/images/og-image.webp
```
in the `og:image` and `twitter:image` meta tags with:
```
https://sitorakarimi.com/assets/images/og-image.jpg
```
(Leave the schema.org `image` array entry as is — webp is fine there.)

- [x] **Step 3: Build, verify, commit** — `523c7ef`

Run: `npm run build && grep -n "og-image.jpg" _site/ru/index.html | head -2`
```bash
git add assets/images/og-image.jpg src/index.njk
git commit -m "fix(seo): serve JPEG og:image for WhatsApp/Telegram preview compatibility"
```

---

### Task 7: Remove invisible Unsplash testimonial background

**Files:**
- Modify: `src/index.njk:824-830` (the `opacity-5` background image div)
- Modify: `src/index.njk:75` (unsplash dns-prefetch)

- [x] **Step 1: Delete the background image wrapper** in the testimonials section:

```html
        <div class="absolute inset-0 opacity-5">
            <img src="https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=2000&q=80"
                 alt="Patient testimonials and reviews background - Happy patients of Dr. Sitora Karimova ophthalmology practice"
                 loading="lazy"
                 width="2000"
                 height="1333"
                 class="w-full h-full object-cover">
        </div>
```
Delete the whole block (the section keeps its `bg-navy-900`).

- [x] **Step 2: Remove the Unsplash dns-prefetch**

Delete from `src/index.njk` head:
```html
    <link rel="dns-prefetch" href="https://images.unsplash.com">
```

- [x] **Step 3: Build, verify, commit** — `ff57faf`

Run: `npm run build && grep -rn "unsplash" _site/ru/index.html`
Expected: no matches.
```bash
git add src/index.njk
git commit -m "perf: remove invisible Unsplash testimonial background image"
```

---

### Task 8: robots.txt cleanup

**Files:**
- Modify: `robots.txt` (full rewrite)

- [x] **Step 1: Replace contents with:**

```
# robots.txt for sitorakarimi.com
# Ophthalmologist website - Dr. Sitora Karimova

User-agent: *
Allow: /

Sitemap: https://sitorakarimi.com/sitemap.xml
```
(The previously disallowed paths don't exist in `_site/`; `Crawl-delay` is ignored by Google; `Disallow: /*.txt$` matched robots.txt itself.)

- [x] **Step 2: Build, verify, commit** — `3e22607`

Run: `npm run build && cat _site/robots.txt`
```bash
git add robots.txt
git commit -m "chore(seo): simplify robots.txt"
```

---

### Task 9: Unify typography on the system font stack

**Files:**
- Modify: `src/blog/post.njk:87-91` and `src/blog/index.njk:69-73` (remove Google Fonts preconnect/preload/noscript)
- Modify: `tailwind.config.js:22` (remove poppins family)
- Modify: `blog/blog.css` (replace any `Poppins` font-family with the system stack, if present)

- [x] **Step 1: Remove from both blog templates:**

```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
```

- [x] **Step 2: Remove the Poppins family from `tailwind.config.js`:** (also removed `font-poppins` class from both blog `<body>` tags — body now inherits the styles.css font rule)

```js
        poppins: ['Poppins', 'sans-serif'],
```
Delete this line. Then grep templates for usage: `grep -rn "font-poppins" src/ blog/` — replace any hits with nothing (inherits body font).

- [x] **Step 3: Check `blog/blog.css` for Poppins** — no Poppins in blog.css; nothing to change

Run: `grep -n "Poppins" blog/blog.css styles.css tailwind.input.css`
Replace any `font-family` containing Poppins with:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

- [x] **Step 4: Rebuild (regenerates tailwind.css), verify, commit** — `f6442c8` (tailwind.css is gitignored — build artifact, not committed)

Run: `npm run build && grep -rn "fonts.googleapis\|Poppins" _site/ru/blog/index.html _site/tailwind.css | head`
Expected: no matches.
```bash
git add src/blog/post.njk src/blog/index.njk tailwind.config.js blog/blog.css tailwind.css
git commit -m "perf: drop Google Fonts (Poppins); system font stack everywhere"
```

---

### Task 10: Replace Font Awesome CDN with self-hosted SVG sprite

**Files:**
- Create: `assets/icons.svg` (SVG sprite, ~35 symbols)
- Modify: `src/index.njk` (remove FA preload/noscript + replace all `<i class="fa...">`)
- Modify: `src/blog/post.njk`, `src/blog/index.njk` (same)
- Modify: `script.js` (FAB icons, mobile-menu toggle)
- Modify: `blog/blog.js` (menu toggle, copy-link swap)
- Modify: `styles.css` (remove FA `@font-face` block lines 5-19; add `.svg-icon` rule)
- Modify: `sw.js` (precache `/assets/icons.svg`)

**Icon inventory and FA 6.4.0 source-file mapping** (icons live at `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.4.0/svgs/<dir>/<file>.svg`):

| Used class | Sprite id | dir/file |
|---|---|---|
| fas fa-star | fa-star | solid/star |
| fas fa-chevron-down | fa-chevron-down | solid/chevron-down |
| fas fa-chevron-right | fa-chevron-right | solid/chevron-right |
| fas fa-quote-left | fa-quote-left | solid/quote-left |
| fas fa-eye | fa-eye | solid/eye |
| fas fa-bars | fa-bars | solid/bars |
| fas fa-times | fa-xmark | solid/xmark |
| fas fa-globe | fa-globe | solid/globe |
| fas fa-newspaper | fa-newspaper | solid/newspaper |
| fas fa-link | fa-link | solid/link |
| fas fa-glasses | fa-glasses | solid/glasses |
| fas fa-eye-dropper | fa-eye-dropper | solid/eye-dropper |
| fas fa-user-md | fa-user-md | solid/user-doctor |
| fas fa-store | fa-store | solid/store |
| fas fa-phone | fa-phone | solid/phone |
| fas fa-microscope | fa-microscope | solid/microscope |
| fas fa-language | fa-language | solid/language |
| fas fa-expand | fa-expand | solid/expand |
| fas fa-comments | fa-comments | solid/comments |
| fas fa-clock | fa-clock | solid/clock |
| fas fa-circle-notch | fa-circle-notch | solid/circle-notch |
| fas fa-circle-dot | fa-circle-dot | solid/circle-dot |
| fas fa-check | fa-check | solid/check |
| fas fa-chart-line | fa-chart-line | solid/chart-line |
| fas fa-arrow-right | fa-arrow-right | solid/arrow-right |
| fas fa-arrow-left | fa-arrow-left | solid/arrow-left |
| far fa-clock | fa-regular-clock | regular/clock |
| far fa-calendar | fa-regular-calendar | regular/calendar |
| fab fa-instagram | fa-instagram | brands/instagram |
| fab fa-facebook | fa-facebook | brands/facebook |
| fab fa-facebook-f | fa-facebook-f | brands/facebook-f |
| fab fa-whatsapp | fa-whatsapp | brands/whatsapp |
| fab fa-twitter | fa-twitter | brands/twitter |
| fab fa-telegram-plane | fa-telegram | brands/telegram |
| fab fa-linkedin | fa-linkedin | brands/linkedin |

- [ ] **Step 1: Build the sprite** with this script (save as `scripts/build-icon-sprite.mjs`, run once, keep in repo for future icon additions):

```js
// Builds assets/icons.svg from Font Awesome Free 6.4.0 sources.
// Font Awesome Free icons: CC BY 4.0 — attribution kept in the sprite header.
import { writeFileSync } from "node:fs";

const ICONS = [
  ["fa-star", "solid/star"], ["fa-chevron-down", "solid/chevron-down"],
  ["fa-chevron-right", "solid/chevron-right"], ["fa-quote-left", "solid/quote-left"],
  ["fa-eye", "solid/eye"], ["fa-bars", "solid/bars"], ["fa-xmark", "solid/xmark"],
  ["fa-globe", "solid/globe"], ["fa-newspaper", "solid/newspaper"], ["fa-link", "solid/link"],
  ["fa-glasses", "solid/glasses"], ["fa-eye-dropper", "solid/eye-dropper"],
  ["fa-user-md", "solid/user-doctor"], ["fa-store", "solid/store"], ["fa-phone", "solid/phone"],
  ["fa-microscope", "solid/microscope"], ["fa-language", "solid/language"],
  ["fa-expand", "solid/expand"], ["fa-comments", "solid/comments"], ["fa-clock", "solid/clock"],
  ["fa-circle-notch", "solid/circle-notch"], ["fa-circle-dot", "solid/circle-dot"],
  ["fa-check", "solid/check"], ["fa-chart-line", "solid/chart-line"],
  ["fa-arrow-right", "solid/arrow-right"], ["fa-arrow-left", "solid/arrow-left"],
  ["fa-regular-clock", "regular/clock"], ["fa-regular-calendar", "regular/calendar"],
  ["fa-instagram", "brands/instagram"], ["fa-facebook", "brands/facebook"],
  ["fa-facebook-f", "brands/facebook-f"], ["fa-whatsapp", "brands/whatsapp"],
  ["fa-twitter", "brands/twitter"], ["fa-telegram", "brands/telegram"],
  ["fa-linkedin", "brands/linkedin"],
];

const BASE = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.4.0/svgs/";
let symbols = "";
for (const [id, file] of ICONS) {
  const res = await fetch(BASE + file + ".svg");
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  const svg = await res.text();
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
                   .replace(/<!--[\s\S]*?-->/g, "").trim();
  symbols += `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>\n`;
}
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n<!-- Icons from Font Awesome Free 6.4.0 — https://fontawesome.com — CC BY 4.0 -->\n${symbols}</svg>\n`;
writeFileSync("assets/icons.svg", sprite);
console.log(`wrote assets/icons.svg with ${ICONS.length} symbols`);
```

Run: `node scripts/build-icon-sprite.mjs`
Expected: `wrote assets/icons.svg with 35 symbols`. Verify: `grep -c "<symbol" assets/icons.svg` → 35.

- [ ] **Step 2: Add `.svg-icon` CSS to `styles.css`** (place where the FA `@font-face` block was, replacing it — delete lines 3-19, the two `@font-face` rules and their comment):

```css
/* Self-hosted SVG icons (replaces Font Awesome webfont) */
.svg-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: -0.125em;
}
```

- [ ] **Step 3: Replace icons in templates.** Pattern — every

```html
<i class="fas fa-NAME extra classes" aria-hidden="true"></i>
```
becomes
```html
<svg class="svg-icon extra classes" aria-hidden="true"><use href="/assets/icons.svg#fa-NAME"></use></svg>
```
Keep all extra utility classes (`text-xl`, `toggle-icon`, `ml-2`, etc.) and `aria-hidden` attributes. Apply the sprite-id mapping for renamed icons (`fa-times`→`fa-xmark`, `far fa-clock`→`fa-regular-clock`, `far fa-calendar`→`fa-regular-calendar`, `fa-telegram-plane`→`fa-telegram`, `fa-user-md` stays `fa-user-md`). Files: `src/index.njk`, `src/blog/post.njk`, `src/blog/index.njk`.

- [ ] **Step 4: Replace dynamic icons in `script.js`.**

FAB markup (lines ~231-240): replace the four `<i>` tags:
```html
<svg class="svg-icon"><use href="/assets/icons.svg#fa-phone"></use></svg>
<svg class="svg-icon"><use href="/assets/icons.svg#fa-whatsapp"></use></svg>
<svg class="svg-icon fab-icon-contact"><use href="/assets/icons.svg#fa-comments"></use></svg>
<svg class="svg-icon fab-icon-close"><use href="/assets/icons.svg#fa-xmark"></use></svg>
```

Mobile-menu toggle (lines ~125-150): the bars/times class swap becomes an `href` swap. Replace the `classList.contains('fa-bars')` block with:
```js
const useEl = icon.querySelector('use');
const isOpen = useEl.getAttribute('href').endsWith('#fa-bars');
useEl.setAttribute('href', isOpen ? '/assets/icons.svg#fa-xmark' : '/assets/icons.svg#fa-bars');
```
(and the close-on-Escape path sets `#fa-bars` unconditionally). Update the selector that finds `icon` if it queries `i` — it must query `svg`.

- [ ] **Step 5: Replace dynamic icons in `blog/blog.js`.**

Line ~58 menu toggle:
```js
icon.querySelector('use').setAttribute('href', open ? '/assets/icons.svg#fa-bars' : '/assets/icons.svg#fa-xmark');
```
Lines ~195-196 copy-link feedback:
```js
icon.querySelector('use').setAttribute('href', '/assets/icons.svg#fa-check');
setTimeout(function () { icon.querySelector('use').setAttribute('href', '/assets/icons.svg#fa-link'); }, 2000);
```
Adjust the `icon` lookups from `i` elements to `svg` elements where needed.

- [ ] **Step 6: Remove Font Awesome loading.** Delete from `src/index.njk`, `src/blog/post.njk`, `src/blog/index.njk`:

```html
    <!-- Font Awesome ... -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" ...>
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" ...></noscript>
```
and the cdnjs preconnect in `src/index.njk`:
```html
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
```

- [ ] **Step 7: Precache the sprite.** Add to `ASSETS_TO_CACHE` in `sw.js`:

```js
    '/assets/icons.svg',
```

- [ ] **Step 8: Build and verify**

Run: `npm run build && grep -rn "fa-\|fontawesome\|cdnjs" _site/ru/index.html _site/ru/blog/index.html | grep -v "icons.svg#fa-" | head`
Expected: no remaining `<i class="fa...">` or cdnjs references; only sprite `use` hrefs.
Then visual check: `python3 -m http.server 8080 --directory _site` and eyeball icons on `/ru/` and `/ru/blog/` (nav, stars, FAB, footer socials, FAQ chevrons).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "perf: replace Font Awesome CDN with self-hosted SVG sprite"
```

---

### Task 11: Tighten CSP and clean remaining resource hints

**Files:**
- Modify: `_headers` (CSP line)

- [ ] **Step 1: Replace the Content-Security-Policy value** with (origins removed: cdnjs, fonts.googleapis, fonts.gstatic, unsplash):

```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' https://www.google.com https://www.googletagmanager.com data:; frame-src https://www.google.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self';
```
Also update the comment above it (no longer "Font Awesome CDN, Google Fonts, Unsplash").

- [ ] **Step 2: Verify nothing in built output still needs removed origins**

Run: `npm run build && grep -rhoE "https://[a-z0-9.-]+" _site/ru/index.html _site/ru/blog/index.html | sort -u`
Expected output contains only: sitorakarimi.com, googletagmanager.com, google.com (maps), wa.me, social profile links (facebook/instagram/linkedin are `href` navigations — not governed by CSP), schema.org.

- [ ] **Step 3: Commit**

```bash
git add _headers
git commit -m "security: tighten CSP after removing third-party CSS/font/image origins"
```

---

### Task 12: Language-aware root redirect

**Files:**
- Modify: `_redirects`

- [ ] **Step 1: Replace contents** (`tg` is the BCP-47 code for Tajik; URL dir stays `/tj/`):

```
/   /en/   302   Language=en
/   /tj/   302   Language=tg
/   /ru/   302
```

- [ ] **Step 2: Build, verify passthrough, commit**

Run: `npm run build && cat _site/_redirects`
```bash
git add _redirects
git commit -m "feat: language-aware root redirect (Accept-Language) with /ru/ fallback"
```
Note: testable only on Netlify after deploy (`curl -H "Accept-Language: en" -I https://sitorakarimi.com/`).

---

### Task 13: Service-worker update toast

**Files:**
- Modify: `src/_data/locales/en.json`, `ru.json`, `tj.json` (new `swUpdate` strings)
- Modify: `script.js:672-681` (replace console.log with toast)
- Modify: `styles.css` (toast styles)

- [ ] **Step 1: Add locale strings** (top-level key in each JSON):

en.json: `"swUpdate": { "message": "The site has been updated", "refresh": "Refresh" }`
ru.json: `"swUpdate": { "message": "Сайт обновлён", "refresh": "Обновить" }`
tj.json: `"swUpdate": { "message": "Сомона нав карда шуд", "refresh": "Навсозӣ" }`

- [ ] **Step 2: Add toast styles to `styles.css`:**

```css
/* Service-worker update toast */
.sw-update-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #0a2a3d;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    display: flex;
    gap: 16px;
    align-items: center;
    z-index: 9999;
    font-size: 0.9rem;
}
.sw-update-toast button {
    background: #ff6b4a;
    color: #fff;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
}
```

- [ ] **Step 3: Replace the silent update log in `script.js`.** Add above the SW registration block:

```js
    function showUpdateToast() {
        if (document.querySelector('.sw-update-toast')) return;
        const t = (window.__T__ && window.__T__.swUpdate) || {};
        const toast = document.createElement('div');
        toast.className = 'sw-update-toast';
        toast.setAttribute('role', 'status');
        const msg = document.createElement('span');
        msg.textContent = t.message || 'The site has been updated';
        const btn = document.createElement('button');
        btn.textContent = t.refresh || 'Refresh';
        btn.addEventListener('click', () => window.location.reload());
        toast.append(msg, btn);
        document.body.appendChild(toast);
    }
```
and replace:
```js
console.log('New content available. Please refresh.');
```
with:
```js
showUpdateToast();
```

- [ ] **Step 4: Build, verify, commit**

Run: `npm run build && grep -n "showUpdateToast\|swUpdate" _site/script.js _site/ru/index.html | head -4`
Expected: function present in script.js; `swUpdate` strings inside the `window.__T__` payload.
```bash
git add src/_data/locales/*.json script.js styles.css
git commit -m "feat: show update toast when a new service worker version installs"
```

---

### Task 14: Remove console noise from production JS

**Files:**
- Modify: `script.js:567-568,670,683` and `vision-test.js` (1 log)

- [ ] **Step 1:** Delete the branded console banner (lines 567-568), delete `console.log('Service Worker registered successfully')`, change the registration `.catch` to `console.warn`. In `vision-test.js`, find the single `console.*` call (`grep -n "console" vision-test.js`) and delete it (keep behavior identical).

- [ ] **Step 2: Verify and commit**

Run: `grep -n "console\." script.js vision-test.js`
Expected: only the `console.warn` in the SW registration catch remains in script.js; zero in vision-test.js.
```bash
git add script.js vision-test.js
git commit -m "chore: remove console noise from production JS"
```

---

### Task 15: Version bump + final build + full verification

**Files:**
- Modify: `sw.js` (CACHE_VERSION, CSS_VERSION, TAILWIND_VERSION → 1.5.0; script.js precache entry → ?v=1.2.0; vision-test/vision-disorders stay 1.1.0 — unchanged files)
- Modify: `src/index.njk` (styles.css preload + stylesheet → ?v=1.5.0; script.js → ?v=1.2.0)
- Modify: `src/blog/post.njk`, `src/blog/index.njk` (styles.css → ?v=1.5.0; tailwind.css → ?v=1.5.0)

- [ ] **Step 1: Bump sw.js:**

```js
const CACHE_VERSION = '1.5.0';
const CSS_VERSION   = '1.5.0';
const TAILWIND_VERSION = '1.5.0';
```
and in `ASSETS_TO_CACHE`: `'/script.js?v=1.2.0'`.

- [ ] **Step 2: Bump templates:** in `src/index.njk` the two `styles.css?v=` references (preload + stylesheet) → `1.5.0`, `script.js?v=` → `1.2.0`. In both blog templates: `styles.css?v=1.5.0`, `tailwind.css?v=1.5.0`.

- [ ] **Step 3: Cross-check versions are consistent:**

Run: `grep -rn "?v=" src/ sw.js | grep -v "_site"`
Expected: styles.css always 1.5.0, tailwind.css 1.5.0, script.js 1.2.0, vision-test.js 1.1.0, vision-disorders.js 1.1.0 — and `sw.js` ASSETS_TO_CACHE entries match exactly.

- [ ] **Step 4: Final build + smoke checks:**

```bash
npm run build
grep -c "992108118080" _site/ru/index.html            # ≥ 2
grep -rn "x-default" _site/ru/index.html              # /ru/
grep -rn "unsplash\|cdnjs\|fonts.googleapis" _site/ru/index.html _site/ru/blog/index.html  # nothing
grep -n "og-image.jpg" _site/ru/index.html            # present
grep -c "<symbol" _site/assets/icons.svg              # 35
```
Then serve `_site` locally and click through: hero, mobile menu open/close (icon swap), testimonial stars, FAB open/close, vision test start, blog listing + one post, language switcher.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(release): bump cache/CSS/tailwind versions to 1.5.0 for deploy"
```

---

### Task 16: CLAUDE.md refresh

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite the stale top sections** to reflect reality:
  - **Tech Stack:** Eleventy 3 (Nunjucks templates), Tailwind CSS 3 compiled via CLI and inlined on the homepage (no CDN), vanilla JS, self-hosted SVG icon sprite (no Font Awesome), system font stack (no Google Fonts), Netlify hosting with `_headers`/`_redirects`.
  - **File Structure:** `src/index.njk` is the homepage source (there is no root `index.html`); `src/_data/locales/*.json` hold all strings; `_site/` is build output; `scripts/build-icon-sprite.mjs` regenerates `assets/icons.svg`.
  - **Development Workflow:** `npm run dev` / `npm run build`; remove "no build process" claims.
  - Remove all stale line-number references to a root `index.html`; remove the `website.png` design-reference section (file no longer exists); remove the Font Awesome and Poppins mentions; note the 12-line vision test and trilingual i18n are current.
  - **Version Management:** keep, but add `TAILWIND_VERSION` to the bump checklist and note blog templates also carry `?v=` on styles.css/tailwind.css.
  - Add a short **Icons** section: how to add an icon (append to `ICONS` in `scripts/build-icon-sprite.mjs`, rerun it, use `<svg class="svg-icon"><use href="/assets/icons.svg#fa-name"></use></svg>`).

- [ ] **Step 2: Verify no false claims remain**

Run: `grep -n "CDN\|index.html lines\|website.png\|Font Awesome\|Poppins\|no build process" CLAUDE.md`
Expected: only accurate mentions (e.g. "no Font Awesome").

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: refresh CLAUDE.md to match Eleventy build, SVG icons, system fonts"
```

---

## Self-Review Notes

- **Coverage:** all 14 analysis findings + 4 user-approved optional items are mapped to Tasks 1-16. The phone decision (108 11 80 80) is baked into Task 1. x-default=/ru/ → Task 2. System fonts → Task 9. FA→SVG, redirect, toast, CLAUDE.md → Tasks 10, 12, 13, 16.
- **Ordering:** external-origin removals (7, 9, 10) precede the CSP tightening (11); all asset changes precede the single version bump (15); docs last (16).
- **Type consistency:** sprite ids referenced in Tasks 10 (templates/JS) match the `ICONS` array ids exactly; version numbers in Task 4 (interim 1.3.2/current) are superseded by Task 15 (1.5.0) deliberately — Task 15 Step 3 cross-checks final consistency.
- **Risk notes:** Task 10 is the only task with visual regression risk — Step 8 mandates a manual browser check. Task 12 is only fully testable post-deploy on Netlify.
