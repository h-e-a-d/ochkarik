# Design System — sitorakarimi.com

Ophthalmologist website for Dr. Sitora Karimova. Minimalist, trust-building aesthetic with smooth micro-interactions. Built with vanilla HTML/CSS/JS + Tailwind CSS.

---

## Colors

### Palette

| Token | Hex | Tailwind class | Usage |
|-------|-----|----------------|-------|
| Navy 900 | `#0a2a3d` | `bg-navy-900` / `text-navy-900` | Primary background, buttons, navbar |
| Navy 800 | `#0f3d56` | `bg-navy-800` | Hover state for navy surfaces |
| Coral | `#ff6b4a` | `bg-coral` / `text-coral` | Accent, icons, active nav, focus rings |
| Green | `#059669` | — | "Yes" / positive action button |
| Green Dark | `#047857` | — | Hover state for green button |
| White | `#ffffff` | `text-white` / `bg-white` | Text on dark surfaces |
| Gray Body | `#333333` | — | Default body text |
| Gray Mid | `#6b7280` | `text-gray-500` | Captions, secondary labels |

### Usage Rules

- Never hardcode hex values in new HTML — use Tailwind tokens or CSS classes.
- Coral is reserved for emphasis only: icons, active states, accent borders. Do not use it for large fills.
- Navy 900 is the single dark surface color. Never introduce additional dark blues.

---

## Typography

### Typefaces

| Family | Weights | Usage |
|--------|---------|-------|
| Montserrat | 300–700 (variable) | All content text |
| -apple-system / Segoe UI / Helvetica Neue / Arial | system fallback | Body fallback stack |
| Georgia (serif) | — | Decorative blockquote `"` glyph only |

**Montserrat is self-hosted** — `assets/fonts/montserrat-*.woff2`, declared via `@font-face`
at the top of `styles.css`. One variable file per script subset covers the whole 300–700
weight range, and `unicode-range` means a browser downloads only what the page renders
(`en` → latin; `ru` → cyrillic + latin; `tg` → cyrillic + cyrillic-ext + latin).

> **Why not Poppins** (which this document specified until 2026-07-17): Poppins ships only
> `latin`, `latin-ext` and `devanagari` — it has **no Cyrillic glyphs at all**. Two of the
> three locales (`ru`, `tg`) are Cyrillic, so Poppins could never render them; they silently
> fell back to a system font while the page still paid for the download. Montserrat is the
> closest geometric sans with full Cyrillic + Cyrillic-ext coverage, including every
> Tajik-specific letter (ғ ӣ қ ӯ ҳ ҷ) — verified against the font's cmap. Manrope, Onest and
> Jost were rejected for missing Tajik letters; Rubik lacks Ҳ/ҳ.
>
> **Any replacement typeface must be checked for Tajik coverage before adoption.**

### Scale

| Element | Size (desktop) | Size (mobile) | Weight | Notes |
|---------|---------------|---------------|--------|-------|
| `h1` | ~4rem | 2.5rem | 300–400 | Letter-spacing `-0.02em` |
| `h2` | ~2.5rem | 2rem | 300 | Section headings |
| `h3` | ~1.5rem | — | 300–500 | Card/subsection titles |
| `body / p` | 1rem | 1rem | 300 | Line-height 1.7 |
| Button label | 14px | 14px | 500 | Uppercase, letter-spacing 1px |
| Nav link | 14px | 14px | 400 | |
| Caption / label | 12px | 10–11px | 400 | Uppercase, wide tracking |

### Rules

- Default weight is **300 (light)**. Only go heavier when hierarchy demands it.
- Headings use `line-height: 1.2`; body uses `line-height: 1.7`.
- `-webkit-font-smoothing: antialiased` applied globally for crispness.

---

## Spacing

Tailwind's default 4px base scale is used throughout.

| Scale | Value | Common use |
|-------|-------|------------|
| 1 | 4px | Tight gaps |
| 2 | 8px | Icon padding |
| 4 | 16px | Mobile section padding |
| 6 | 24px | Inner card padding |
| 8 | 32px | Desktop section padding |
| 12 | 48px | Section vertical rhythm |
| 16 | 64px | Large section gaps |
| 24 | 96px | Hero vertical padding |

Section vertical padding follows `py-20` (80px) on desktop, `py-12` (48px) on mobile.

---

## Buttons

All buttons share a common base: `inline-flex`, centered content, `border-radius: 4px`, `transition: all 0.3s ease`, uppercase 14px 500-weight labels, 1px letter-spacing. Hover lifts with `translateY(-2px)`.

### Variants

| Class | Background | Text | Border | Use case |
|-------|-----------|------|--------|----------|
| `.btn-navy` | `#0a2a3d` | white | `2px solid #0a2a3d` | Primary CTA on light backgrounds |
| `.btn-outline` | transparent | `#0a2a3d` | `2px solid #0a2a3d` | Secondary action on light backgrounds |
| `.btn-white` | white | `#0a2a3d` | `2px solid white` | **Primary** CTA on dark/navy backgrounds |
| `.btn-outline-white` | transparent | white | `2px solid white` | **Secondary** action on dark/navy backgrounds |
| `.btn-green` | `#059669` | white | `2px solid #059669` | Positive/confirmatory actions only (vision test) |

**Pairing rule for dark surfaces:** use `.btn-white` (primary) + `.btn-outline-white`
(secondary). Never `.btn-navy` on a navy surface — it is `#0a2a3d` on `#0a2a3d`, so it
vanishes into the background and cedes the visual hierarchy to the outline button next to it.

### Padding

- Default: `16px 40px`
- Mobile (`< 768px`): full-width, stacked vertically

### Hover Shadows

- `.btn-navy` hover: `0 10px 25px rgba(10, 42, 61, 0.2)`
- `.btn-green` hover: `0 10px 25px rgba(5, 150, 105, 0.3)`
- `.btn-outline` hover: fills navy solid
- `.btn-outline-white` hover: fills white, text turns navy

---

## Elevation & Shadow

| Context | Value |
|---------|-------|
| Button hover | `0 10px 25px rgba(10, 42, 61, 0.2)` |
| Navbar scrolled | `0 2px 20px rgba(0, 0, 0, 0.1)` |
| Map overlay card | `backdrop-filter: blur(10px)` |
| Results table | `0 2px 8px rgba(0, 0, 0, 0.1)` |

Avoid `box-shadow` on animated elements (use `transform` + pseudo-elements to stay on the GPU compositor).

---

## Borders & Radius

- Border radius: **4px** on all buttons and interactive cards (consistent square-ish feel).
- Accent borders: `2px solid coral` or `2px solid navy-900`.
- Pulse ring on stats circle: `2px solid rgba(255, 107, 74, 0.4)` animated via pseudo-element.

---

## Animation & Motion

### Keyframes

| Name | Effect | Duration |
|------|--------|----------|
| `fadeInUp` | opacity 0→1, translateY 40px→0 | 0.8s ease-out |
| `slowZoom` | scale 1→1.05 | 20s ease-in-out infinite alternate |
| `pulse-ring` | scale 1→1.18, opacity 0.4→0 | 3s ease-in-out infinite |
| `spin` | rotate 360deg | 1s linear infinite |
| `fadeIn` | opacity 0→1 (page load) | 0.5s ease-in |

### Transition Defaults

- Global easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's default ease)
- Standard duration: `0.3s`
- Long reveal: `0.8s`
- Carousel cross-fade: `0.6s`

### Rules

- Always use `will-change: transform` or `will-change: opacity` on GPU-promoted elements.
- Read all layout values before writing DOM changes in animation loops (no layout thrash).
- Use `prefers-reduced-motion` override — all animations collapse to `0.01ms`.
- Never animate `box-shadow` directly; use a pseudo-element with `transform: scale`.

---

## Navigation

- Fixed top, full-width.
- **Transparent** by default → `rgba(10, 42, 61, 0.95)` + `backdrop-filter: blur(10px)` after 100px scroll (`.scrolled` class).
- Backdrop blur is **disabled on mobile** (GPU-expensive on every scroll frame).
- Active link and hover color: Coral `#ff6b4a`.
- Mobile menu slides in via `max-height` transition (0 → `calc(100vh - 80px)`).

---

## Cards

### Service Card (`.service-card-minimal`)

- Transparent background, no border, no shadow.
- Hover: `translateY(-5px)`.
- Icon: coral color, scales to 1.1× on card hover.
- Description text: 5-line clamp with fade-out gradient; click to expand (`.expanded` toggles max-height).

---

## Iconography

- **Self-hosted SVG sprite** `assets/icons.svg` (Font Awesome Free 6.4.0 symbols, CC BY 4.0). No CDN, no icon webfont — the CSP no longer allows cdnjs.
  Usage: `<svg class="svg-icon" aria-hidden="true"><use href="/assets/icons.svg#fa-eye"></use></svg>`. Sizes with text-size utilities, colours with `currentColor`.
  Add icons via `scripts/build-icon-sprite.mjs` then re-run it — never hand-edit the sprite.
- Icon color: coral (`text-coral`) for accent icons; white for nav/footer icons.
- Do not install additional icon libraries.

---

## Scrollbar (WebKit)

```
width: 8px
track: #f1f1f1
thumb: #0a2a3d  →  hover: #ff6b4a
border-radius: 4px
```

---

## Text Selection

```css
background-color: #ff6b4a;
color: white;
```

---

## Accessibility

- Focus ring: `3px solid #ff6b4a`, `outline-offset: 4px`, `border-radius: 4px` on all `a` and `button` elements (`:focus-visible` only — hidden for mouse users).
- Skip-to-content link: coral background, slides in on focus.
- High-contrast mode: button borders widen to `3px`.
- `prefers-reduced-motion`: all animation/transition durations reduced to `0.01ms`.
- Semantic HTML structure throughout; ARIA labels on FAB and interactive controls.
- Touch targets use `touch-action: manipulation` to remove 300ms tap delay.

---

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Mobile | `< 768px` | Single column, stacked buttons, mobile menu |
| Tablet/Desktop | `≥ 768px` (md) | Multi-column layouts, horizontal nav |
| Wide Desktop | `≥ 1024px` (lg) | Full layout, custom cursor active |

---

## Page Loader

Full-screen navy overlay (`#0a2a3d`) with spinning coral ring (`.loader-icon`) during initial load. Fades out with `opacity/visibility` transition (`0.5s`). Transition disabled on mobile to avoid delaying LCP.

---

## Version Bump Checklist

Whenever `styles.css` changes, update all three together:

1. `sw.js` → `CSS_VERSION`
2. `sw.js` → `CACHE_VERSION` (same value)
3. `src/index.njk` → `?v=` query string on the stylesheet `<link>`

Same rule applies to JS files (`script.js`, `vision-test.js`, etc.) — bump `CACHE_VERSION` whenever any cached asset changes.
