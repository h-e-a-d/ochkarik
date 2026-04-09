# Blog System Documentation

Complete blog system for sitorakarimi.com — multilingual, SEO-optimized, with an AI-powered content creation engine.

---

## Architecture Overview

```
Project Root
├── blog/                          # Static assets (copied to _site/blog/)
│   ├── blog.css                   # Blog-specific styles
│   ├── blog.js                    # Blog-specific JavaScript
│   └── post-template.json         # Template for creating new posts
│
├── src/
│   ├── blog/
│   │   ├── index.njk              # Blog listing page (→ /{lang}/blog/)
│   │   └── post.njk               # Individual post page (→ /{lang}/blog/{slug}/)
│   │
│   └── _data/
│       ├── blogPosts.js           # Loads all post JSON files, sorted by date
│       ├── blogPages.js           # Generates locale × post page combinations
│       └── blog/
│           └── posts/             # One JSON file per article (all languages)
│               └── YYYY-MM-DD-slug.json
│
└── assets/images/blog/            # Blog post images
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Posts as JSON** (not Markdown files) | One file = one article in all 3 languages. Easy for Claude to create/update programmatically. |
| **Separate blog.css/blog.js** | Blog pages don't load the main site's heavy scripts (vision-test.js, vision-disorders.js, glasses animation). Faster page loads. |
| **No shared layout template** | Blog pages have their own nav (with absolute links to main site sections instead of anchor links). Avoids coupling to single-page nav logic. |
| **Translations stay in main locale files** | Blog UI strings (button labels, categories) live in en.json/ru.json/tj.json alongside the rest of the site. No separate blog translation files — keeps the i18n system unified. |

---

## URL Structure

| Page | URL Pattern | Example |
|------|------------|---------|
| Blog listing | `/{lang}/blog/` | `/en/blog/`, `/ru/blog/`, `/tj/blog/` |
| Blog post | `/{lang}/blog/{slug}/` | `/en/blog/atropine-myopia-control-children/` |

Every page includes:
- `<link rel="canonical">` pointing to itself
- `<link rel="alternate" hreflang="...">` for all available language versions
- `hreflang="x-default"` pointing to `/ru/blog/...` (same as the main site)

---

## Post JSON Format

Each post is a single JSON file in `src/_data/blog/posts/`. Filename convention: `YYYY-MM-DD-slug.json`.

```json
{
  "id": "2026-04-08-atropine-myopia-children",
  "slug": "atropine-myopia-control-children",
  "date": "2026-04-08",
  "image": "/assets/images/blog/atropine-myopia.webp",
  "category": "research",
  "tags": ["myopia", "pediatric", "treatment"],
  "author": "Dr. Sitora Karimova",
  "readingTime": 5,
  "source": {
    "url": "https://source-url.com/article",
    "name": "American Academy of Ophthalmology",
    "date": "2026-04-01"
  },
  "aiTranslated": ["ru", "tj"],
  "en": {
    "title": "Article Title",
    "excerpt": "Short summary for cards and social.",
    "metaDescription": "SEO description under 160 chars.",
    "content": "Full markdown content..."
  },
  "ru": { ... },
  "tj": { ... }
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier. Convention: `YYYY-MM-DD-slug` |
| `slug` | Yes | URL slug. Lowercase, hyphens only. Same across all languages. |
| `date` | Yes | Publication date (`YYYY-MM-DD`) |
| `image` | No | Hero image path. Recommended: WebP, 1200x630px for OG sharing |
| `category` | No | One of: `research`, `treatments`, `prevention`, `pediatric`, `technology`, `lifestyle` |
| `tags` | No | Array of lowercase tag strings |
| `author` | No | Defaults to "Dr. Sitora Karimova" if omitted |
| `readingTime` | No | Estimated minutes to read |
| `source` | No | Original source attribution (for rewritten news) |
| `source.url` | — | Link to original article |
| `source.name` | — | Publication name |
| `source.date` | — | Original publication date |
| `aiTranslated` | No | Array of language codes that were AI-translated (e.g., `["ru", "tj"]`) |
| `en` / `ru` / `tj` | At least `en` | Language-specific content block |
| `*.title` | Yes | Article headline |
| `*.excerpt` | Yes | 1-2 sentence summary |
| `*.metaDescription` | Yes | SEO meta description (max 160 chars) |
| `*.content` | Yes | Full article in markdown |

### Content Markdown Syntax

The `content` field supports:
- `## Heading 2` and `### Heading 3`
- `**bold**` and `*italic*`
- `- unordered lists` and `1. ordered lists`
- `[link text](url)`
- `---` horizontal rules
- `> blockquotes`
- `` `inline code` ``

Content is rendered client-side by blog.js's markdown parser and styled by blog.css's `.blog-content` rules.

---

## AI Translation Banner

When a post's `aiTranslated` array includes the current language code, a fixed amber banner appears below the navbar:

- **Russian**: "Эта статья переведена с помощью ИИ."
- **Tajik**: "Ин мақола бо ёрии зеҳни сунъӣ тарҷума шудааст."

The banner includes a "View original (English)" link pointing to the EN version.

The banner does **not** appear on the English version, since English is the original content language.

---

## SEO Features

### Per-page SEO
- Unique `<title>` and `<meta description>` per post per language
- Canonical URLs
- Hreflang tags for all language variants
- Open Graph tags (type: `article` for posts, `website` for listing)
- Twitter Card tags
- `article:published_time`, `article:author`, `article:section`, `article:tag` meta

### Structured Data (JSON-LD)
- **Blog listing**: `@type: Blog` schema
- **Blog posts**: `@type: Article` schema with author, publisher, datePublished, image

### Breadcrumbs
Post pages include breadcrumb navigation: Home > Blog > Post Title

---

## Content Creation Engine

### Overview

The content creation engine is a workflow designed for Claude Code to process ophthalmology news from RSS feeds and produce multilingual blog posts.

### Workflow

```
RSS Feed → Claude reads article → Rewrites in EN → Translates to RU/TJ → Creates post JSON → Build
```

### Step-by-Step Process

#### 1. Feed Sources (Connect via RSS MCP)

Recommended ophthalmology RSS feeds:

| Source | Focus | URL |
|--------|-------|-----|
| AAO Eye Health | Patient education | aao.org RSS |
| Review of Ophthalmology | Clinical news | reviewofophthalmology.com RSS |
| Ophthalmology Times | Industry news | ophthalmologytimes.com RSS |
| JAMA Ophthalmology | Research | jamanetwork.com/journals/jamaophthalmology RSS |
| BMJ Eye | Research | bjo.bmj.com RSS |

To connect: Add an RSS MCP server to your Claude Code configuration. Then ask Claude to scan feeds for new articles.

#### 2. Article Selection Criteria

When scanning feeds, Claude should prioritize articles that are:

- **Relevant to general patients** (not highly specialized surgical technique papers)
- **Locally relevant** to Central Asia / Tajikistan where possible
- **Actionable** — readers can learn something they can apply
- **Evergreen-leaning** — content that stays relevant for months, not days

Good categories:
- New treatments or therapies (especially for common conditions: myopia, dry eye, cataracts, glaucoma)
- Prevention tips and lifestyle advice
- Pediatric eye health (strong topic for the practice)
- Technology advances in diagnosis or correction
- Seasonal eye health advice

Avoid:
- Highly technical surgical papers
- Drug pricing / insurance topics (not relevant to Tajikistan market)
- Controversy-heavy pieces

#### 3. Content Rewriting (English First)

Claude should **rewrite** (not copy) the article:

- Original voice and perspective, as if written by Dr. Karimova's practice
- Add a "What this means for patients in Dushanbe" section when relevant
- Include a call-to-action at the end (appointment scheduling)
- Keep reading time to 4-7 minutes (800-1400 words)
- Use clear, patient-friendly language (avoid medical jargon without explanation)
- Structure with `## Headings` for scannability

#### 4. Translation to RU and TJ

After the English version is finalized:

- **Russian (RU)**: Translate fully. Use medical terminology appropriate for Russian-speaking patients. The Russian audience is the primary audience.
- **Tajik (TJ)**: Translate fully. Use Tajik Cyrillic script. Medical terms can be kept in their Russian/international forms where Tajik equivalents don't exist.

Both RU and TJ versions must be marked in `aiTranslated`:
```json
"aiTranslated": ["ru", "tj"]
```

#### 5. Create the Post File

Use `blog/post-template.json` as a starting point. Save to:
```
src/_data/blog/posts/YYYY-MM-DD-slug.json
```

#### 6. Build and Verify

```bash
npm run build
```

Check that pages are generated:
- `_site/en/blog/slug/index.html`
- `_site/ru/blog/slug/index.html`
- `_site/tj/blog/slug/index.html`

### Claude Command Template

When you want Claude to create a new blog post from a news article, use this prompt:

```
Read this article: [URL or RSS item]

Create a blog post for sitorakarimi.com following the content engine workflow in blog.md:
1. Rewrite the article in English with a patient-friendly perspective
2. Translate to Russian and Tajik
3. Save as a post JSON file in src/_data/blog/posts/
4. Use today's date and generate an appropriate slug
5. Set the source attribution
6. Mark RU and TJ as AI-translated
```

### Batch Content Creation

For creating multiple posts from an RSS feed scan:

```
Scan the [RSS feed name] for recent ophthalmology articles.
Select the top 3 most relevant for our patient audience.
Create blog posts for each following the workflow in blog.md.
```

---

## Adding a New Post (Manual)

1. Copy `blog/post-template.json`
2. Fill in all fields (at minimum: `id`, `slug`, `date`, `en` block)
3. Save to `src/_data/blog/posts/YYYY-MM-DD-your-slug.json`
4. (Optional) Add an image to `assets/images/blog/`
5. Run `npm run build`
6. Verify at `http://localhost:8000/{lang}/blog/your-slug/`

---

## Adding a New Category

1. Pick a key name (lowercase, no spaces)
2. Add translations to all three locale files under `blog.categories`:

```json
// en.json
"categories": { ..., "newcat": "New Category" }

// ru.json
"categories": { ..., "newcat": "Новая категория" }

// tj.json
"categories": { ..., "newcat": "Категорияи нав" }
```

3. Use the key in your post's `category` field

---

## Styling

### Blog CSS (`blog/blog.css`)

| Section | What it styles |
|---------|---------------|
| AI Translation Banner | Fixed amber banner below navbar for AI-translated content |
| Blog Card Grid | Card hover effects, image zoom, category badges |
| Blog Post Content | Typography for `h2`, `h3`, `p`, `ul`, `ol`, `blockquote`, `hr`, `code` |
| Tags | Pill-shaped tag badges |
| Share Buttons | Circular share buttons (Twitter, Facebook, Telegram, Copy Link) |
| Responsive | Mobile adjustments at 768px breakpoint |
| Print | Hides nav, footer, share buttons for printing |

### Design Tokens (Inherited from Main Site)

| Token | Value | Usage |
|-------|-------|-------|
| Navy 900 | `#0a2a3d` | Headings, navbar, buttons |
| Coral | `#ff6b4a` | Accent, links, categories, hover states |
| Font | Poppins 300/400/500/600 | All text |

---

## JavaScript (`blog/blog.js`)

Handles:
- **Language switching** — Replaces language segment in URL path
- **Mobile menu** — Toggle with hamburger/close icon
- **Markdown rendering** — Client-side conversion of markdown content to HTML
- **Share buttons** — Twitter, Facebook, Telegram share popups + clipboard copy
- **Language dropdown** — Desktop dropdown open/close with outside-click dismiss

Does NOT include (intentionally): parallax, custom cursor, intersection observer animations, vision test, glasses animation, or any main site interactive features.

---

## Service Worker

Blog listing pages (`/{lang}/blog/`) are pre-cached in `sw.js`. Individual post pages are cached on first visit (cache-first strategy with background network update).

When adding the blog system, the SW cache version was bumped to `1.2.0`.

---

## Deployment Checklist

When deploying blog updates:

1. Ensure all post JSON files are valid (no trailing commas, proper escaping)
2. Run `npm run build` and check for errors
3. Verify generated HTML in `_site/{lang}/blog/`
4. Bump `CACHE_VERSION` in `sw.js` if CSS/JS changed
5. Commit and deploy

---

## Future Enhancements

- **RSS feed output**: Generate `/blog/feed.xml` for the blog itself
- **Pagination**: When posts exceed ~12, add page 2, page 3, etc.
- **Search**: Client-side search using a generated JSON index
- **Related posts**: Show related articles at the bottom of post pages
- **Newsletter signup**: Email collection for blog update notifications
- **Reading progress bar**: Visual indicator of scroll progress on post pages
- **Comments**: Integrate a comment system (e.g., Giscus, Disqus)
- **Auto-publish schedule**: Cron-based content pipeline for weekly posts
