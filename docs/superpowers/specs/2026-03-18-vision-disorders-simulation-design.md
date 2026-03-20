# Vision Disorders Simulation Section — Design Spec

**Date:** 2026-03-18
**Status:** Approved

---

## Overview

A new interactive section for the Dr. Sitora Karimova ophthalmologist website that lets visitors simulate four vision conditions using CSS filter effects applied to a street-level city photograph. The section is purely interactive — no descriptive text per condition, just the simulation itself.

---

## Section Identity

- **Placement:** Between the Partners section and the Vision Test section (or between Partners and Contact if Vision Test is absent)
- **Section ID:** `#vision-disorders`
- **Module file:** `vision-disorders.js` (new standalone IIFE, mirrors the pattern of `vision-test.js`)
- **Section label:** "Interactive Demo"
- **Section heading:** "See the World Through Different Eyes"
- **Section subheading:** "Explore how common vision disorders affect everyday sight"

---

## HTML Markup

Add this section to `index.html` between the Partners section and Vision Test section:

```html
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
      <span class="vd-slider-label" data-i18n="visionDisorders.sliderSevere">Severe</span>
    </div>

    <p class="vd-hint" data-i18n="visionDisorders.hint">Try each condition and drag the slider to explore severity levels</p>
  </div>
</section>
```

- The **Healthy** tab has `class="vd-tab active"` in HTML — it is the default active tab on page load
- `vision-disorders.js` is loaded with `<script src="vision-disorders.js"></script>` before `</body>`, immediately after the existing `<script src="vision-test.js"></script>`

---

## Required CSS (append to `styles.css`)

```css
/* === Vision Disorders Section === */

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
  object-position: center 20%; /* tuned for vision-street.jpg — revisit if image changes */
}

/* Transition class applied only on tab switch, never during slider drag */
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

---

## Visual Effects

**Severity variable:** `v = sliderValue / 100` (normalized 0–1 float) in all formulas.

### Healthy
- Call `resetEffects()`. Remove `.visible` from `#vd-slider-row` to hide slider.

### Myopia
- **Accepted approximation:** CSS `blur()` applies uniformly; true myopia causes depth-dependent blur. Noted for educational context.
- `img.style.filter = \`blur(${v * 10}px)\``

### Cataracts
- `img.style.filter = \`blur(${v*4}px) brightness(${1 - v*0.35}) sepia(${v*0.6}) contrast(${1 - v*0.2})\``
- `overlay.style.background = \`rgba(255, 245, 200, ${v * 0.35})\``
- `overlay.style.opacity = '1'`

### Glaucoma
- `innerR = Math.max(5, 55 - v * 50)` → 55% (mild) → 5% (severe)
- `midR = Math.min(innerR + 25, 90)` → soft dark ring edge
- `overlay.style.background = \`radial-gradient(ellipse 50% 50% at 50% 50%, transparent ${innerR}%, rgba(0,0,0,0.7) ${midR}%, rgba(0,0,0,0.97) 100%)\``
- `overlay.style.opacity = '1'`
- `img.style.filter = \`brightness(${1 - v * 0.2})\``

### resetEffects()
```js
function resetEffects() {
  img.style.filter = '';
  img.style.transition = '';    // clears any inline override, restores CSS class control
  overlay.style.opacity = '0';
  overlay.style.background = 'none';
}
```

---

## JavaScript Architecture (`vision-disorders.js`)

```js
(function () {
  'use strict';

  const CONFIG = {
    defaultSeverity: 50,
    defaultCondition: 'healthy',
  };

  let currentCondition = CONFIG.defaultCondition;
  let img, overlay, sliderRow, slider;

  function init() {
    if (!document.getElementById('vision-disorders')) return;

    img = document.getElementById('vd-image');
    overlay = document.getElementById('vd-overlay');
    sliderRow = document.getElementById('vd-slider-row');
    slider = document.getElementById('vd-slider');

    // Attach tab listeners
    document.querySelectorAll('.vd-tab').forEach(btn => {
      btn.addEventListener('click', () => setCondition(btn.dataset.condition));
    });

    // Attach slider listener — no transition during drag
    slider.addEventListener('input', () => {
      updateEffect(parseInt(slider.value), false);
    });

    // Initial state: Healthy is active (already marked in HTML), slider hidden, no filter
    // No updateEffect() call needed on init — Healthy = no effect
  }

  function setCondition(name) {
    currentCondition = name;

    // Update active tab
    document.querySelectorAll('.vd-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.condition === name);
    });

    // Show/hide slider
    if (name === 'healthy') {
      sliderRow.classList.remove('visible');
    } else {
      sliderRow.classList.add('visible');
    }

    // Reset slider to default
    slider.value = CONFIG.defaultSeverity;

    // Apply effect with tab-switch transition
    updateEffect(CONFIG.defaultSeverity, true);
  }

  function updateEffect(sliderValue, isTabSwitch) {
    const v = sliderValue / 100;

    if (isTabSwitch) {
      // Add transition class before applying filter — fires 0.4s CSS ease
      img.classList.add('vd-transitioning');
      setTimeout(() => img.classList.remove('vd-transitioning'), 400);
    } else {
      // Suppress transition during slider drag to prevent restart lag
      img.style.transition = 'none';
    }

    resetEffects();

    if (currentCondition === 'myopia') applyMyopia(v);
    else if (currentCondition === 'cataracts') applyCataracts(v);
    else if (currentCondition === 'glaucoma') applyGlaucoma(v);
    // healthy: resetEffects() already cleared everything
  }

  function applyMyopia(v) {
    img.style.filter = `blur(${v * 10}px)`;
  }

  function applyCataracts(v) {
    img.style.filter = `blur(${v*4}px) brightness(${1 - v*0.35}) sepia(${v*0.6}) contrast(${1 - v*0.2})`;
    overlay.style.background = `rgba(255, 245, 200, ${v * 0.35})`;
    overlay.style.opacity = '1';
  }

  function applyGlaucoma(v) {
    const innerR = Math.max(5, 55 - v * 50);
    const midR = Math.min(innerR + 25, 90);
    overlay.style.background = `radial-gradient(ellipse 50% 50% at 50% 50%,
      transparent ${innerR}%,
      rgba(0,0,0,0.7) ${midR}%,
      rgba(0,0,0,0.97) 100%)`;
    overlay.style.opacity = '1';
    img.style.filter = `brightness(${1 - v * 0.2})`;
  }

  function resetEffects() {
    img.style.filter = '';
    img.style.transition = '';
    overlay.style.opacity = '0';
    overlay.style.background = 'none';
  }

  function getCondition() { return currentCondition; }

  window.VisionDisorders = { init, getCondition };
  document.addEventListener('DOMContentLoaded', init);
})();
```

---

## Image Asset

- **Unsplash photo ID:** `photo-1542038784456-1ea8e935640e`
- **Download URL:** `https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=85&fm=jpg`
- **Save to:** `assets/images/vision-street.jpg`
- Download command: `curl -L "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=85&fm=jpg" -o "assets/images/vision-street.jpg"`
- No hotlinking in production per Unsplash terms of service

---

## Service Worker (`sw.js`)

Current version at time of spec: `'1.0.6'`

Changes:
1. Increment `CACHE_VERSION`: `'1.0.6'` → `'1.0.7'`
2. Add to `ASSETS_TO_CACHE`:
   ```js
   '/vision-disorders.js',
   '/assets/images/vision-street.jpg',
   ```

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| < 768px | Image height → 280px; pill tabs flex-wrap; slider full width; section padding 40px 20px |
| ≥ 768px | Full desktop layout |

---

## i18n Attributes

| Key | Default text |
|-----|-------------|
| `visionDisorders.label` | Interactive Demo |
| `visionDisorders.title` | See the World Through Different Eyes |
| `visionDisorders.subtitle` | Explore how common vision disorders affect everyday sight |
| `visionDisorders.tabs.healthy` | Healthy |
| `visionDisorders.tabs.myopia` | Myopia |
| `visionDisorders.tabs.cataracts` | Cataracts |
| `visionDisorders.tabs.glaucoma` | Glaucoma |
| `visionDisorders.sliderMild` | Mild |
| `visionDisorders.sliderSevere` | Severe |
| `visionDisorders.hint` | Try each condition and drag the slider to explore severity levels |

---

## Out of Scope

- No per-condition description text
- No results tracking or analytics
- No backend calls
- No canvas-based pixel rendering
- No SVG filter effects
