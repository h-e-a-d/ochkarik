# Vision Disorders Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive "See the World Through Different Eyes" section between Partners and Vision Test in `index.html`, letting users simulate Myopia, Cataracts, and Glaucoma via CSS filter effects on a street photo with a severity slider.

**Architecture:** A standalone IIFE module (`vision-disorders.js`) queries DOM elements by ID, attaches event listeners, and applies CSS `filter` + radial-gradient overlay effects. A shared `#vd-overlay` div handles both the Cataracts fog and Glaucoma tunnel. Tab switch uses a `.vd-transitioning` CSS class for a smooth filter transition; slider drag bypasses transitions to prevent restart lag.

**Tech Stack:** Vanilla JS (no build), CSS filters, Tailwind CSS (existing CDN), custom `.vd-*` CSS classes in `styles.css`.

**Spec:** `docs/superpowers/specs/2026-03-18-vision-disorders-simulation-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `assets/images/vision-street.jpg` | Create | Street photo asset |
| `styles.css` | Modify (append) | All `.vd-*` layout + effect styles |
| `index.html` | Modify | Section HTML + script tag |
| `vision-disorders.js` | Create | All interaction logic (IIFE) |
| `sw.js` | Modify | Cache version bump + new asset entries |

---

## Task 1: Download the street photo asset

**Files:**
- Create: `assets/images/vision-street.jpg`

- [ ] **Step 1: Download image**

```bash
curl -L "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=85&fm=jpg" \
  -o "assets/images/vision-street.jpg"
```

- [ ] **Step 2: Verify file exists and is non-empty**

```bash
ls -lh assets/images/vision-street.jpg
```

Expected: file listed, size ~200–400KB

---

## Task 2: Add CSS styles

**Files:**
- Modify: `styles.css` (append at bottom)

- [ ] **Step 1: Append the Vision Disorders CSS block to the bottom of `styles.css`**

Add this entire block at the end of the file:

```css
/* ============================================
   Vision Disorders Section
   ============================================ */

.vision-disorders-section {
    background: #ffffff;
    padding: 80px 40px;
    text-align: center;
}

.vision-disorders-inner {
    max-width: 820px;
    margin: 0 auto;
}

.vd-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ff6b4a;
    margin-bottom: 12px;
}

.vd-title {
    font-size: 36px;
    font-weight: 700;
    color: #0a2a3d;
    margin-bottom: 8px;
}

.vd-subtitle {
    font-size: 15px;
    color: #6b7280;
    font-weight: 300;
    margin-bottom: 40px;
}

.vd-tabs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
    flex-wrap: wrap;
}

.vd-tab {
    padding: 10px 28px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 2px solid #d1d5db;
    background: white;
    color: #0a2a3d;
}

.vd-tab.active {
    background: #0a2a3d;
    color: white;
    border-color: #0a2a3d;
}

.vd-tab:not(.active):hover {
    border-color: #0a2a3d;
}

.vd-image-container {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(10, 42, 61, 0.18);
    margin-bottom: 32px;
}

#vd-image {
    width: 100%;
    display: block;
    height: 420px;
    object-fit: cover;
    object-position: center 20%;
    /* object-position tuned for vision-street.jpg — revisit if image changes */
}

/* Applied only on tab switch, never during slider drag */
#vd-image.vd-transitioning {
    transition: filter 0.4s ease;
}

#vd-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease, background 0.4s ease;
}

.vd-slider-row {
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.vd-slider-row.visible {
    opacity: 1;
    pointer-events: auto;
}

.vd-slider-label {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
    white-space: nowrap;
    min-width: 36px;
}

#vd-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(to right, #0a2a3d 50%, #d1d5db 50%);
    outline: none;
    cursor: pointer;
}

#vd-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0a2a3d;
    box-shadow: 0 2px 8px rgba(10, 42, 61, 0.3);
    cursor: pointer;
}

.vd-hint {
    margin-top: 20px;
    font-size: 12px;
    color: #9ca3af;
}

@media (max-width: 768px) {
    .vision-disorders-section {
        padding: 40px 20px;
    }

    #vd-image {
        height: 280px;
    }

    .vd-slider-row {
        max-width: 100%;
    }
}
```

- [ ] **Step 2: Open `index.html` in browser and verify no style regressions**

```bash
python3 -m http.server 8000
```

Visit http://localhost:8000 — existing sections should look unchanged.

---

## Task 3: Add the HTML section

**Files:**
- Modify: `index.html` — insert between line ~912 (end of Partners) and line ~913 (start of Vision Test `<section id="vision-test"`)

- [ ] **Step 1: Locate the insertion point**

Find the comment `<!-- Vision Test Section -->` in `index.html` (line ~912). The new section goes immediately before it.

- [ ] **Step 2: Insert the Vision Disorders section HTML**

Insert this block immediately before `<!-- Vision Test Section -->`:

```html
    <!-- Vision Disorders Section -->
    <section id="vision-disorders" class="vision-disorders-section">
        <div class="vision-disorders-inner">
            <p class="vd-label" data-i18n="visionDisorders.label">Interactive Demo</p>
            <h2 class="vd-title" data-i18n="visionDisorders.title">See the World Through Different Eyes</h2>
            <p class="vd-subtitle" data-i18n="visionDisorders.subtitle">Explore how common vision disorders affect everyday sight</p>

            <div class="vd-tabs" role="tablist">
                <button class="vd-tab active" data-condition="healthy" data-i18n="visionDisorders.tabs.healthy">Healthy</button>
                <button class="vd-tab" data-condition="myopia" data-i18n="visionDisorders.tabs.myopia">Myopia</button>
                <button class="vd-tab" data-condition="cataracts" data-i18n="visionDisorders.tabs.cataracts">Cataracts</button>
                <button class="vd-tab" data-condition="glaucoma" data-i18n="visionDisorders.tabs.glaucoma">Glaucoma</button>
            </div>

            <div class="vd-image-container">
                <img id="vd-image" src="assets/images/vision-street.jpg" alt="City street scene" />
                <div id="vd-overlay"></div>
            </div>

            <div class="vd-slider-row" id="vd-slider-row">
                <span class="vd-slider-label" data-i18n="visionDisorders.sliderMild">Mild</span>
                <input type="range" id="vd-slider" min="0" max="100" value="50" aria-label="Severity" />
                <span class="vd-slider-label vd-slider-label-right" data-i18n="visionDisorders.sliderSevere">Severe</span>
            </div>

            <p class="vd-hint" data-i18n="visionDisorders.hint">Try each condition and drag the slider to explore severity levels</p>
        </div>
    </section>

```

- [ ] **Step 3: Verify section renders in browser**

Reload http://localhost:8000, scroll to the section. You should see:
- Coral "Interactive Demo" label
- Navy heading and grey subtitle
- 4 pill tabs (Healthy active/navy, others white with grey border)
- Street photo at 420px height with rounded corners and shadow
- No slider visible yet (it's hidden — correct)
- Grey hint text below

---

## Task 4: Create `vision-disorders.js` — skeleton + init

**Files:**
- Create: `vision-disorders.js`

- [ ] **Step 1: Create the file with the IIFE skeleton and init**

```js
/**
 * Vision Disorders Simulation
 * Interactive section simulating Myopia, Cataracts, and Glaucoma
 * via CSS filter effects on a street photo.
 */
(function () {
    'use strict';

    const CONFIG = {
        defaultSeverity: 50,
        defaultCondition: 'healthy',
    };

    let currentCondition = CONFIG.defaultCondition;
    let img, overlay, sliderRow, slider;

    // ─── Init ────────────────────────────────────────────────────────────────

    function init() {
        if (!document.getElementById('vision-disorders')) return;

        img       = document.getElementById('vd-image');
        overlay   = document.getElementById('vd-overlay');
        sliderRow = document.getElementById('vd-slider-row');
        slider    = document.getElementById('vd-slider');

        // Tab listeners
        document.querySelectorAll('.vd-tab').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setCondition(btn.dataset.condition);
            });
        });

        // Slider listener — no CSS transition during drag
        slider.addEventListener('input', function () {
            updateEffect(parseInt(slider.value, 10), false);
        });

        // Initial state: Healthy tab already marked .active in HTML
        // No updateEffect() needed — Healthy = no filter applied
    }

    // ─── Condition switching ─────────────────────────────────────────────────

    function setCondition(name) {
        currentCondition = name;

        document.querySelectorAll('.vd-tab').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.condition === name);
        });

        if (name === 'healthy') {
            sliderRow.classList.remove('visible');
            resetEffects();
        } else {
            sliderRow.classList.add('visible');
            slider.value = CONFIG.defaultSeverity;
            updateEffect(CONFIG.defaultSeverity, true);
        }
    }

    // ─── Effect engine ───────────────────────────────────────────────────────

    function updateEffect(sliderValue, isTabSwitch) {
        var v = sliderValue / 100;

        if (isTabSwitch) {
            img.classList.add('vd-transitioning');
            setTimeout(function () {
                img.classList.remove('vd-transitioning');
            }, 400);
        } else {
            img.style.transition = 'none';
        }

        resetEffects();

        if (currentCondition === 'myopia')    { applyMyopia(v); }
        else if (currentCondition === 'cataracts') { applyCataracts(v); }
        else if (currentCondition === 'glaucoma')  { applyGlaucoma(v); }
    }

    function applyMyopia(v) {
        img.style.filter = 'blur(' + (v * 10) + 'px)';
    }

    function applyCataracts(v) {
        img.style.filter = [
            'blur(' + (v * 4) + 'px)',
            'brightness(' + (1 - v * 0.35) + ')',
            'sepia(' + (v * 0.6) + ')',
            'contrast(' + (1 - v * 0.2) + ')',
        ].join(' ');
        overlay.style.background = 'rgba(255, 245, 200, ' + (v * 0.35) + ')';
        overlay.style.opacity    = '1';
    }

    function applyGlaucoma(v) {
        var innerR = Math.max(5, 55 - v * 50);
        var midR   = Math.min(innerR + 25, 90);
        overlay.style.background = [
            'radial-gradient(ellipse 50% 50% at 50% 50%,',
            '  transparent ' + innerR + '%,',
            '  rgba(0,0,0,0.7) ' + midR + '%,',
            '  rgba(0,0,0,0.97) 100%)',
        ].join('\n');
        overlay.style.opacity   = '1';
        img.style.filter = 'brightness(' + (1 - v * 0.2) + ')';
    }

    function resetEffects() {
        img.style.filter     = '';
        img.style.transition = '';   // clears inline override, restores CSS class control
        overlay.style.opacity    = '0';
        overlay.style.background = 'none';
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    function getCondition() { return currentCondition; }

    window.VisionDisorders = { init: init, getCondition: getCondition };
    document.addEventListener('DOMContentLoaded', init);

}());
```

- [ ] **Step 2: Add the script tag to `index.html`**

Find the existing line in `index.html`:
```html
    <script src="vision-test.js"></script>
```

Add the new script immediately after it:
```html
    <script src="vision-disorders.js"></script>
```

- [ ] **Step 3: Verify the module loads without errors**

Open browser DevTools → Console. Reload http://localhost:8000.
Expected: no errors. `window.VisionDisorders` is defined — confirm in console:
```js
VisionDisorders.getCondition() // → "healthy"
```

---

## Task 5: Verify all four conditions interactively

**Files:** none (verification only)

- [ ] **Step 1: Test Healthy tab**

Reload the page, scroll to the Vision Disorders section.
- "Healthy" pill is navy/active
- Photo shows with no filter applied (crisp, full color)
- Severity slider is invisible (opacity 0)

- [ ] **Step 2: Test Myopia**

Click "Myopia" pill.
- Pill becomes navy/active
- Slider appears with value at 50 (mid)
- Photo is moderately blurred (~5px)
- Drag slider left (toward Mild): blur decreases toward 0
- Drag slider right (toward Severe): blur increases to ~10px

- [ ] **Step 3: Test Cataracts**

Click "Cataracts" pill.
- Photo becomes foggy, yellowish, lower contrast
- Slider at 50: moderate effect
- Drag to Severe: strong yellow fog, significant blur and desaturation

- [ ] **Step 4: Test Glaucoma**

Click "Glaucoma" pill.
- Dark vignette appears around edges; center stays clear
- Drag to Severe: tunnel vision — center circle shrinks to a small bright spot, edges nearly black

- [ ] **Step 5: Test tab switch animation**

Click rapidly between conditions. Each switch should animate with a smooth 0.4s filter fade. Slider dragging should feel instant (no lag/stutter).

- [ ] **Step 6: Test returning to Healthy**

Click "Healthy" from any condition. Photo resets to clear, slider disappears.

- [ ] **Step 7: Test mobile layout**

Open DevTools → device toolbar → set width to 375px.
- Image height: 280px
- Pill tabs wrap to two rows (2 pills per row)
- Slider spans full width
- Section padding is compact (40px 20px)

---

## Task 6: Update Service Worker

**Files:**
- Modify: `sw.js`

- [ ] **Step 1: Increment `CACHE_VERSION`**

In `sw.js` line 6, change:
```js
const CACHE_VERSION = '1.0.6';
```
to:
```js
const CACHE_VERSION = '1.0.7'; // Vision disorders simulation feature
```

- [ ] **Step 2: Add new assets to `ASSETS_TO_CACHE`**

In the `ASSETS_TO_CACHE` array (lines 10–22), add the two new entries:
```js
    '/vision-disorders.js',
    '/assets/images/vision-street.jpg',
```

The final array should include all existing entries plus these two.

- [ ] **Step 3: Verify SW update**

Hard-reload the browser (Cmd+Shift+R). Open DevTools → Application → Service Workers.
Confirm the new SW is installed and active. No console errors.

---

## Task 7: Final check and commit

- [ ] **Step 1: Full visual pass**

Scroll through the entire page top to bottom:
- All sections before and after Vision Disorders look unchanged
- Vision Disorders section has correct white background (contrasts with navy Partners above and white Vision Test below)
- No layout shifts, no overflow, no z-index conflicts

- [ ] **Step 2: Check the slider track fill**

The slider track should show navy color to the left of the thumb and grey to the right. This is done via CSS `background: linear-gradient(...)` — it's static at 50% split. This is a known limitation (the fill doesn't update as you drag). It's acceptable for this feature; no dynamic JS needed for the track.

- [ ] **Step 3: Commit all changes**

```bash
git add assets/images/vision-street.jpg styles.css index.html vision-disorders.js sw.js
git commit -m "feat: add vision disorders simulation section

Interactive section simulating Myopia, Cataracts, and Glaucoma
using CSS filters on a street photo with a severity slider."
```
