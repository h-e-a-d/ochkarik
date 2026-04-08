# Translations Framework

This document describes the multilingual/SEO framework for sitorakarimi.com. The site is built as a **static multi-page application** where each language (Russian, Tajik, English) is rendered at build time into its own fully-crawlable HTML file under a dedicated URL prefix.

- Primary audience: Dushanbe (Russian + Tajik speakers)
- Secondary: English
- Default language: **Russian** (`/ru/`)
- Build tool: **Eleventy (11ty)** — static site generator, zero-runtime, ships plain HTML

---

## 1. Why Eleventy (and not the old JS i18n)

### Problem with the old approach
The previous system stored all translations in `script.js` inside a `translations` object and swapped `data-i18n` attributes at runtime. The crawled HTML was **English only** — Google never saw the Russian or Tajik content, so the site was invisible to the vast majority of its actual audience.

### What Eleventy gives us
1. **Three real HTML files**, one per language, each with localized `<title>`, `<meta>`, Open Graph, and body content.
2. **Single source of truth**: one Nunjucks template + three JSON locale files → three output pages. No triplicate HTML.
3. **Zero runtime cost**: output is plain static HTML/CSS/JS. Deploy the `_site/` folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, plain nginx).
4. **Preserves existing assets**: `styles.css`, `script.js`, `vision-test.js`, `vision-disorders.js`, `sw.js`, `assets/` are passed through unchanged.
5. **hreflang, canonical, sitemap** generated per locale automatically.

---

## 2. URL Structure

```
https://sitorakarimi.com/             → 302 redirect to /ru/
https://sitorakarimi.com/ru/          → Russian (primary)
https://sitorakarimi.com/tj/          → Tajik
https://sitorakarimi.com/en/          → English
https://sitorakarimi.com/sitemap.xml  → lists all three
https://sitorakarimi.com/robots.txt
```

Subdirectories (not subdomains) were chosen because they consolidate domain authority and are Google's recommended pattern for multi-regional/multilingual sites.

### Root redirect
Served by the host (e.g. Netlify `_redirects`):
```
/   /ru/   302
```
As a fallback for plain-file hosting, a root `index.html` can do a meta refresh plus JS `navigator.language` sniffing.

---

## 3. Project Structure (post-migration)

```
ochkarik-main/
├── .eleventy.js              # Eleventy config
├── package.json              # npm scripts + @11ty/eleventy dependency
├── translations.md           # this document
├── src/
│   ├── _data/
│   │   └── locales/
│   │       ├── ru.json       # Russian strings (default)
│   │       ├── tj.json       # Tajik strings
│   │       └── en.json       # English strings
│   ├── _includes/
│   │   ├── layout.njk        # base HTML shell (head, nav, footer)
│   │   └── partials/         # hero.njk, services.njk, about.njk, faq.njk, etc.
│   ├── index.njk             # page template (uses pagination over locales)
│   └── robots.njk
├── assets/                   # passed through unchanged
├── styles.css                # passed through
├── script.js                 # passed through (translations object removed)
├── vision-test.js            # passed through
├── vision-disorders.js       # passed through
├── sw.js                     # passed through (bump CACHE_VERSION on release)
└── _site/                    # BUILD OUTPUT — do not edit, do not commit
    ├── ru/index.html
    ├── tj/index.html
    ├── en/index.html
    ├── sitemap.xml
    ├── robots.txt
    ├── assets/
    ├── styles.css
    └── script.js
```

---

## 4. How a Page is Generated

Eleventy iterates over an array of locale codes and renders `src/index.njk` once per locale, writing each output into `_site/<lang>/index.html`.

### 4.1 `src/index.njk` (simplified)

```njk
---
pagination:
  data: locales
  size: 1
  alias: lang
permalink: "/{{ lang }}/index.html"
eleventyComputed:
  t: "{{ locales[lang].strings }}"
  lang: "{{ lang }}"
layout: layout.njk
---

{% include "partials/hero.njk" %}
{% include "partials/services.njk" %}
{% include "partials/about.njk" %}
{% include "partials/faq.njk" %}
{# etc. #}
```

- `pagination.data: locales` makes Eleventy loop over the global `locales` data.
- `permalink` places each rendered page at `/ru/`, `/tj/`, `/en/`.
- `t` is the translation dictionary for the current locale; partials reference `{{ t.hero.title }}` instead of `data-i18n` attributes.

### 4.2 `src/_data/locales.js`

```js
const ru = require('./locales/ru.json');
const tj = require('./locales/tj.json');
const en = require('./locales/en.json');

module.exports = {
  ru: { code: 'ru', htmlLang: 'ru',      hreflang: 'ru', name: 'Русский',  strings: ru },
  tj: { code: 'tj', htmlLang: 'tg',      hreflang: 'tg', name: 'Тоҷикӣ',   strings: tj },
  en: { code: 'en', htmlLang: 'en',      hreflang: 'en', name: 'English',  strings: en },
};
```

Note the BCP-47 codes: Tajik is `tg` in `hreflang` and `<html lang>`, but we keep `tj` in URLs for brand familiarity.

### 4.3 `src/_includes/layout.njk` (head section)

```njk
<!DOCTYPE html>
<html lang="{{ locales[lang].htmlLang }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ t.meta.title }}</title>
  <meta name="description" content="{{ t.meta.description }}">

  <link rel="canonical" href="https://sitorakarimi.com/{{ lang }}/">
  {% for code, loc in locales %}
  <link rel="alternate" hreflang="{{ loc.hreflang }}" href="https://sitorakarimi.com/{{ code }}/">
  {% endfor %}
  <link rel="alternate" hreflang="x-default" href="https://sitorakarimi.com/ru/">

  <meta property="og:locale" content="{{ locales[lang].htmlLang }}">
  <meta property="og:title" content="{{ t.meta.ogTitle }}">
  <meta property="og:description" content="{{ t.meta.description }}">
  <meta property="og:url" content="https://sitorakarimi.com/{{ lang }}/">

  <script type="application/ld+json">
    {{ t.schema.localBusiness | safe }}
  </script>

  <link rel="stylesheet" href="/styles.css">
</head>
<body data-lang="{{ lang }}">
  {% include "partials/nav.njk" %}
  {{ content | safe }}
  {% include "partials/footer.njk" %}
  <script src="/script.js"></script>
  <script src="/vision-test.js"></script>
  <script src="/vision-disorders.js"></script>
</body>
</html>
```

### 4.4 Language switcher

The nav switcher links to **actual URLs**, not JS handlers. This is essential for SEO — crawlers follow the links, and users get real page loads with correct history entries.

```njk
<nav class="lang-switcher" aria-label="Language">
  {% for code, loc in locales %}
    <a href="/{{ code }}/"
       {% if code == lang %}aria-current="page"{% endif %}
       hreflang="{{ loc.hreflang }}">{{ loc.name }}</a>
  {% endfor %}
</nav>
```

---

## 5. Locale JSON Schema

Each `src/_data/locales/<lang>.json` mirrors the structure of the old `translations` object in `script.js`, plus new SEO-only fields (`meta`, `schema`) that didn't exist before.

```jsonc
{
  "meta": {
    "title": "Офтальмолог в Душанбе — Доктор Ситора Каримова",
    "description": "Профессиональная офтальмологическая помощь...",
    "ogTitle": "Доктор Ситора Каримова — офтальмолог в Душанбе"
  },
  "schema": {
    "localBusiness": "{ \"@context\": \"https://schema.org\", ... }"
  },
  "nav":          { "home": "Главная", "services": "Услуги", ... },
  "hero":         { "title": "...", "description": "...", ... },
  "services":     { "comprehensive": { "title": "...", "intro": "..." }, ... },
  "about":        { ... },
  "testimonials": { ... },
  "faq":          { ... },
  "visionTest":   { ... },
  "visionDisorders": { ... },
  "contact":      { ... },
  "footer":       { ... }
}
```

Rules:
- **Keep key structure identical across all three locales.** Missing keys will render as empty strings.
- **HTML is allowed** inside strings (e.g. `<strong>`, `<br>`, `<em>`, `<li>`) — Nunjucks outputs strings raw when marked `| safe`.
- **Never put data-i18n-style keys in the HTML templates.** All text comes from `{{ t.* }}` lookups.
- **Numerals and dates** that differ per locale (e.g. phone formatting) live in the JSON, not the template.

---

## 6. SEO-only fields per locale

These did not exist in the old system and must be authored fresh. They are the primary SEO wins.

| Field | Purpose |
|---|---|
| `meta.title` | `<title>` — ~60 chars, includes primary keyword + city |
| `meta.description` | `<meta name="description">` — ~155 chars, compelling CTA |
| `meta.ogTitle` | Open Graph / social share title |
| `schema.localBusiness` | JSON-LD structured data: address, geo, opening hours, phone, `@type: MedicalClinic` |

**Russian example (seed values):**
```
meta.title:       "Офтальмолог в Душанбе — Д-р Ситора Каримова | Оптика Osse"
meta.description: "Комплексное обследование зрения, подбор очков и контактных линз в Душанбе. 8+ лет опыта. Приём в оптике Osse, ул. Бехзода 14. +992 108 11 80 80"
```

**Tajik example (seed values):**
```
meta.title:       "Офтальмолог дар Душанбе — Д-р Ситора Каримова"
meta.description: "Ташхиси пурраи чашм, интихоби айнак ва линзаҳои контактӣ дар Душанбе. Беш аз 8 соли таҷриба. Кӯчаи Беҳзод 14. +992 108 11 80 80"
```

---

## 7. Build & Dev Workflow

### Install once
```bash
npm install
```

### Develop (live reload)
```bash
npm run dev
```
Eleventy serves `_site/` at `http://localhost:8080` with hot reload on template/CSS/JSON changes.

### Production build
```bash
npm run build
```
Outputs fully static files to `_site/`. Upload that directory to the host.

### Deployment
- **Netlify / Vercel / Cloudflare Pages**: set build command `npm run build`, publish directory `_site`.
- **Plain nginx/Apache**: rsync `_site/` to the web root.
- **GitHub Pages**: push `_site/` to the `gh-pages` branch (or use an action).

### Root redirect
Create `_redirects` in project root (passed through by Eleventy):
```
/   /ru/   302
```

---

## 8. Migration Plan (old → new)

1. **Scaffold** — `package.json`, `.eleventy.js`, `src/` tree, empty locale JSONs. *(done — see files in repo)*
2. **Extract translations** — copy the three language blocks from `script.js` (`translations.en`, `ru`, `tj`) into `src/_data/locales/{en,ru,tj}.json`. Validate with `JSON.parse`.
3. **Add SEO fields** — author `meta.*` and `schema.*` for each locale (see §6).
4. **Break up `index.html`** — move each section (hero, services, about, testimonials, partners, FAQ, vision-test, contact, footer) into its own `src/_includes/partials/*.njk` partial. Replace hardcoded English text with `{{ t.section.key }}` or `{{ t.section.key | safe }}` for HTML content.
5. **Remove `translations` object from `script.js`** — Eleventy now owns it. Any remaining runtime uses (e.g. dynamic "Read More" toggles) should read from a small inline `<script>window.__LOCALE__ = {{ t | dump | safe }}</script>` block in the layout, or from `document.documentElement.lang` plus a pruned dictionary.
6. **Remove all `data-i18n` attributes** — they no longer do anything.
7. **Update language switcher** — replace JS click handlers with real `<a href="/ru/">`-style links.
8. **Add `hreflang` + canonical** — already in `layout.njk` §4.3.
9. **Generate per-locale `sitemap.xml`** — Eleventy template loops over `locales` and emits `<url><loc>` + `<xhtml:link rel="alternate" hreflang="...">`.
10. **Bump `sw.js` `CACHE_VERSION`** — see CLAUDE.md release checklist.
11. **QA** — see §9.

---

## 9. QA Checklist

- [ ] `curl https://sitorakarimi.com/ru/ | grep -c "Каримова"` returns >0 (Cyrillic content in raw HTML)
- [ ] `curl https://sitorakarimi.com/tj/ | grep -c "Тоҷикӣ"` returns >0
- [ ] `curl https://sitorakarimi.com/en/ | grep "<html lang=\"en\">"` matches
- [ ] Each page has its own `<title>`, `<meta description>`, canonical
- [ ] All three pages cross-link via `hreflang` tags (including `x-default`)
- [ ] Language switcher shows real `<a href>` attributes, not `javascript:` or `#`
- [ ] `/` redirects to `/ru/` (check `curl -I`)
- [ ] `sitemap.xml` lists all three URLs
- [ ] Google Rich Results Test passes on JSON-LD for each locale
- [ ] Vision test, vision disorders, glasses animation, mobile menu all work on each locale (pages share the same JS)
- [ ] Lighthouse SEO score ≥ 95 on all three
- [ ] `sw.js` `CACHE_VERSION` bumped before deploying

---

## 10. Adding a New String

1. Open all three files in `src/_data/locales/` (`ru.json`, `tj.json`, `en.json`).
2. Add the same key in the same nested location to **all three**. Missing keys render empty.
3. Reference it in the relevant partial: `{{ t.section.newKey }}`.
4. For HTML content: `{{ t.section.newKey | safe }}`.
5. `npm run dev` to verify locally.

## 11. Adding a New Language

1. Create `src/_data/locales/<code>.json` with the same key structure.
2. Register it in `src/_data/locales.js`:
   ```js
   uz: { code: 'uz', htmlLang: 'uz', hreflang: 'uz', name: 'Oʻzbekcha', strings: uz }
   ```
3. Update the language switcher — it iterates `locales` automatically, no template edit needed.
4. Add SEO fields (`meta.*`, `schema.*`) for the new language.
5. Add to `sitemap.xml` template loop (also automatic).
6. Bump `sw.js` cache version.

---

## 12. What Stays the Same

- `styles.css` — unchanged, copied through.
- `script.js` — minus the `translations` object and `data-i18n` swap logic. All behavior (scroll effects, mobile menu, glasses animation, back-to-top, etc.) is preserved.
- `vision-test.js`, `vision-disorders.js` — unchanged.
- `assets/` — unchanged.
- `sw.js` — unchanged except for the cache version bump on each release.
- Visual design, color palette, typography, button styles — all preserved.

## 13. What Changes

- `index.html` at the repo root is **replaced** by `src/index.njk` + partials. The old file can be kept temporarily as a reference, then deleted.
- Text content lives in JSON, not HTML.
- Deploy target is `_site/`, not the repo root.
- Dev workflow requires `node` + `npm install` once.

---

## 14. Noob Guide: How to Edit Translations (Step by Step)

This section assumes **zero prior knowledge**. If you just want to change a piece of text on the site in one or more languages, follow this.

### The mental model in 30 seconds

- The website has three languages: **Russian (`ru`)**, **Tajik (`tj`)**, **English (`en`)**.
- All visible text lives in **three JSON files** — one per language — under `src/_data/locales/`:
  - `src/_data/locales/ru.json`
  - `src/_data/locales/tj.json`
  - `src/_data/locales/en.json`
- These files have the **same structure** (same keys in the same places). Only the values differ.
- When you change text in these files and save, Eleventy rebuilds the site. The three language pages (`/ru/`, `/tj/`, `/en/`) get regenerated automatically.
- You do **not** edit `index.html` or `script.js` to change text anymore. Only the JSON files.

### One-time setup (do this once, ever)

Open the Terminal app, navigate to the project folder, and install dependencies:

```bash
cd /Users/egalvans/Downloads/Head/Claude/ochkarik-main
npm install
```

You should see a `node_modules/` folder appear. That's it. You never have to do this again unless you move the project to a new computer.

### Start the live preview server

Every time you want to edit translations, start the preview server first:

```bash
npm run dev
```

You'll see something like `Server at http://localhost:8080/`. Open that URL in your browser. Navigate to:
- `http://localhost:8080/ru/` for Russian
- `http://localhost:8080/tj/` for Tajik
- `http://localhost:8080/en/` for English

**Leave this terminal running** while you edit. Every time you save a JSON file, the browser auto-refreshes.

To stop the server later: click in the terminal and press `Ctrl+C`.

### Step-by-step: changing one piece of text

**Example task:** "Change the hero subtitle from 'Ophthalmology Practice' to 'Trusted Eye Care' in English."

**Step 1 — Find the text on the live site.**
Open `http://localhost:8080/en/` in your browser. Find the text you want to change on the page. Right-click it → "Inspect" (this is optional — it can help you find the key faster).

**Step 2 — Find the key.**
Open `src/_data/locales/en.json` in your editor. Search (Cmd+F) for the exact English text: `Ophthalmology Practice`. You'll find:

```json
"hero": {
  "subtitle": "Ophthalmology Practice",
  "title": "Exceptional eye care",
  ...
}
```

The **key path** is `hero.subtitle`. Remember this — you'll edit the same key in the other two languages.

**Step 3 — Change the English value.**
Replace the text on the right side of the colon, keeping the quotes:

```json
"subtitle": "Trusted Eye Care",
```

Save the file. Your browser at `/en/` should auto-refresh and show the new text.

**Step 4 — Update the other two languages.**
Open `src/_data/locales/ru.json` and find the same `hero.subtitle` key. Replace the Russian translation:

```json
"subtitle": "Надёжный уход за глазами",
```

Save. Check `http://localhost:8080/ru/` in your browser.

Open `src/_data/locales/tj.json`. Find `hero.subtitle`. Replace the Tajik translation:

```json
"subtitle": "Нигоҳубини боэътимоди чашм",
```

Save. Check `http://localhost:8080/tj/`.

**Step 5 — Done.** Three languages updated. When you later deploy, all three URLs will have the new text.

### The golden rules (read these twice)

1. **Never delete a comma, brace `{`, bracket `[`, or quote `"`** unless you know what you're doing. JSON is strict — one wrong character breaks the whole file and the build fails.
2. **Every string must be wrapped in double quotes** `"like this"`, not single quotes, not curly quotes. Smart quotes from Word/Pages will break JSON.
3. **The three JSON files must have the same keys in the same structure.** If you add a new key to `en.json`, add it to `ru.json` and `tj.json` too. If a language is missing a key, that text will render blank on that language's page.
4. **Don't rename keys.** If you rename `hero.subtitle` to something else, the template stops finding it and the text disappears from the site. Only change the **values** (the right side of the colon).
5. **HTML is allowed inside strings.** If you see tags like `<strong>`, `<br>`, `<em>`, `<li>` inside a value, keep them — they render as real HTML. Example: `"title": "Excellence <em>since 2017</em>"`.
6. **Escape double quotes inside text.** If your translation contains a `"` character, write it as `\"`. Example: `"quote1": "\"Dr. Karimova is excellent.\""`. (You'll see this pattern in the testimonials section.)

### What if I break the JSON file?

If you mess up a comma or quote, when you save, the preview browser will show an error or the page will stop updating. Don't panic:

1. Look at the terminal where `npm run dev` is running. It will print a red error like:
   ```
   SyntaxError: Unexpected token } in JSON at position 1234
   ```
2. The number is the character position. Open the file, Cmd+G (or Go to Line) to jump near the problem.
3. Common fixes:
   - Missing comma between two lines: add `,` at the end of the previous line.
   - Extra trailing comma after the last item in an object/array: remove it.
   - Unclosed quote: find the missing `"`.
   - Curly quotes: replace `"` / `"` with straight `"`.
4. If you're really stuck, use an online JSON validator like https://jsonlint.com — paste the whole file, it will point to the error line.
5. Worst case: run `git status` to see your changes, then `git checkout src/_data/locales/<file>.json` to revert it to the last committed version. You'll lose your edits but the site works again.

### Common tasks — cookbook

#### Change existing text
See the step-by-step above.

#### Add a completely new piece of text to a page
You can't do this by editing only JSON — you also need to add the placeholder to the template (`src/index.njk`). This is a developer task. Ask for help, or see §10 of this document.

#### Change contact info (phone, email, address)
Open all three locale files and look for the `contact` section:
```json
"contact": {
  "address1": "Bekhzod Street 14",
  "address2": "Dushanbe, Tajikistan",
  ...
}
```
Phone and email are also in `contact`. Remember to update all three languages.

#### Update SEO title and description (the text Google shows in search results)
Top of each locale file, under `meta`:
```json
"meta": {
  "title": "Ophthalmologist in Dushanbe — Dr. Sitora Karimova",
  "description": "Comprehensive eye exams ..."
}
```
- `meta.title` — keep under ~60 characters.
- `meta.description` — keep under ~155 characters. This is what shows in Google search results, so make it compelling.

#### Update FAQ questions and answers
Each locale file has a `faq` section with `question1`..`question6` and `answer1`..`answer6`. To change the third question, edit `faq.question3` in all three files.

#### Update testimonials
Each locale has `testimonials.quote1`..`quote4`, `name1`..`name4`, `patient1`..`patient4`. The quotes contain escaped double quotes: `"\"Dr. Karimova..."`. Keep the `\"` pattern when editing.

### Deploying your changes (after you're happy)

1. Stop the preview server: `Ctrl+C` in the terminal.
2. Build the production site:
   ```bash
   npm run build
   ```
   This creates/updates the `_site/` folder with the final HTML.
3. Commit your changes to git (the `_site/` folder is ignored — only the source files and locale JSONs get committed):
   ```bash
   git add src/_data/locales/
   git commit -m "Update translations"
   git push
   ```
4. **Cloudflare Pages** will automatically detect the push, run `npm run build`, and publish the new `_site/` to sitorakarimi.com. No manual upload needed.
5. **Before a release, bump the service worker cache version** — open `sw.js`, increment `CACHE_VERSION` (e.g. `1.1.0` → `1.1.1`). This forces returning visitors to see the new content instead of the old cached version. Commit this change with your translation updates.

### The absolute shortest version

1. `npm run dev` (once, leave running)
2. Edit `src/_data/locales/ru.json`, `tj.json`, `en.json`
3. Save → browser refreshes automatically
4. When done: `Ctrl+C`, then `git add -A && git commit -m "..." && git push`
5. Cloudflare Pages deploys automatically

---

## 15. References

- Eleventy docs: https://www.11ty.dev/docs/
- Google: managing multi-regional/multilingual sites — https://developers.google.com/search/docs/specialty/international
- `hreflang` spec — https://www.w3.org/International/questions/qa-html-language-declarations
- Schema.org MedicalClinic — https://schema.org/MedicalClinic
