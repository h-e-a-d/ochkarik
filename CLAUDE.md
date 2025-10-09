# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page ophthalmologist website for Dr. Sitora Karimova (sitorakarimi.com) featuring a minimalist design with smooth animations, responsive layout, and modern UX patterns. The site is built with vanilla HTML, CSS, and JavaScript using Tailwind CSS for styling.

## Tech Stack

- **Frontend Framework**: Vanilla JavaScript (no build process)
- **CSS Framework**: Tailwind CSS (via CDN)
- **Custom CSS**: `styles.css` for animations and enhanced styling
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)

## Architecture

### File Structure

- `index.html` - Main single-page application with all sections (hero, services, about, testimonials, partners, vision test, contact, footer)
- `script.js` - All interactive functionality and animations
- `vision-test.js` - **Separate modular script for interactive vision test feature (can be easily enabled/disabled)**
- `styles.css` - Custom CSS for animations, transitions, and design enhancements
- `website.png` - Reference design file (6MB PNG for UX/UI reference)
- `assets/images/table-ru.svg` - Russian Snellen vision chart for the vision test feature

### Design System

**Color Palette:**
- Navy 900: `#0a2a3d` (primary dark)
- Navy 800: `#0f3d56` (hover state)
- Coral: `#ff6b4a` (accent color)
- White and grays for text/backgrounds

**Typography:**
- Font family: Poppins (300, 400, 500, 600, 700 weights)
- Font weights: 300 (light/default), 400 (regular), 500 (medium/buttons)

**Button Styles:**
- `.btn-navy` - Solid navy button with hover lift effect
- `.btn-outline` - Outlined button (navy on white backgrounds)
- `.btn-outline-white` - White outlined button (for dark backgrounds)

### Key JavaScript Features (script.js)

The script.js file handles all interactivity through a single DOMContentLoaded event listener:

1. **Mobile Menu Toggle** - Hamburger menu with icon animation (lines 9-39)
2. **Smooth Scrolling** - Anchor link navigation with navbar offset (lines 45-66)
3. **Active Nav Highlight** - Updates nav links based on scroll position (lines 72-94)
4. **Navbar Background** - Adds .scrolled class after 100px scroll (lines 100-108)
5. **Intersection Observer** - Fade-in animations for service cards and sections (lines 114-139)
6. **Parallax Effect** - Hero section background parallax (lines 145-153)
7. **Back to Top Button** - Dynamically created, appears after 500px scroll (lines 159-181)
8. **Stats Counter** - Animates "15+" number when scrolled into view (lines 187-218)
9. **Lazy Loading** - Image lazy loading with IntersectionObserver (lines 224-240)
10. **Custom Cursor** - Desktop-only cursor follow effect (lines 246-281)
11. **Hero Text Animation** - Initial fade-in for hero title (lines 287-297)
12. **Keyboard Accessibility** - ESC closes mobile menu, Tab detection (lines 303-317)
13. **Debounced Scroll** - Performance optimization for scroll handlers (lines 323-340)
14. **Smooth Reveal** - Fade-in animation for h2, p, buttons (lines 345-365)

### HTML Sections

1. **Navigation** (lines 140-195) - Fixed navbar with mobile menu and language switcher
2. **Hero** (lines 198-234) - Full-screen with background image and gradient overlay
3. **Services** (lines 237-300) - 6 service cards in grid layout on navy background
4. **About** (lines 303-356) - Two-column layout with text and image carousel
5. **Stats Circle** (lines 359-372) - Single centered circle with "8+ Years" stat
6. **Testimonials** (lines 375-489) - Carousel with 4 testimonials, quote styling, and star ratings
7. **Partners** (lines 492-518) - Icon grid (placeholder logos for partnerships)
8. **Vision Test** (lines 520-582) - **Interactive vision test section** (see Vision Test Feature section below)
9. **Contact** (lines 584-578) - Google Maps iframe with overlay card + contact info
10. **Footer** (lines 581-638) - 4-column layout with links and social icons

## Development Workflow

### Running Locally

No build process required. Simply open `index.html` in a browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if http-server is installed)
npx http-server -p 8000
```

Visit `http://localhost:8000` in your browser.

### Testing

- Test responsive breakpoints at 768px (md) and 1024px (lg)
- Verify mobile menu functionality on mobile devices
- Check scroll animations work in all major browsers
- Test keyboard navigation (Tab, Escape keys)
- Verify accessibility with screen readers

### Making Changes

**Content Updates:**
- Edit text directly in `index.html`
- Update doctor name, credentials, services in respective sections
- Replace Unsplash images with actual photos

**Styling Changes:**
- Modify Tailwind config in `index.html` lines 12-24 for colors
- Add custom animations/effects in `styles.css`
- Button styles defined in `styles.css` lines 23-91

**Behavior Changes:**
- All interactivity logic is in `script.js`
- Each feature is clearly commented with section headers
- Modify scroll thresholds, animation delays, and timings as needed

### Important Implementation Details

1. **Navbar behavior**: Transparent by default, becomes opaque with `.scrolled` class after 100px scroll
2. **Service cards**: Use `.service-card-minimal` class with fade-in-up animation and staggered delays
3. **Image sources**: Currently using Unsplash via CDN - replace with actual assets
4. **Google Maps**: Embedded iframe pointing to San Francisco - update with actual clinic location
5. **Contact info**: Placeholder phone/email in contact section (lines 332-337)
6. **Mobile breakpoint**: 768px (md) - mobile menu shows below this
7. **Custom cursor**: Only active on desktop (window width > 768px)

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses IntersectionObserver API (requires polyfill for IE11)
- CSS custom properties used in Tailwind config
- Service Worker code present but commented out (lines 388-393)

### Accessibility Features

- Focus outlines on interactive elements (styles.css:274-278)
- Keyboard navigation support (Escape, Tab)
- Reduced motion media query support (styles.css:400-408)
- High contrast mode support (styles.css:411-416)
- ARIA label on back-to-top button
- Semantic HTML structure

### Performance Optimizations

- Debounced scroll event handlers (50ms delay)
- IntersectionObserver for lazy loading and animations
- Staggered animation delays to prevent jank
- Minimal external dependencies (only CDN resources)

### Design Reference

The `website.png` file (6MB) contains the original design mockup. When making UI/UX changes, reference this file to maintain design consistency with the original vision.

---

## Vision Test Feature

### Overview

The Vision Test is an **interactive eye examination feature** that allows website visitors to test their vision using a Russian Snellen chart (`table-ru.svg`). This feature is positioned between the Partners and Contact sections and is designed as a **standalone, modular component** for easy enabling/disabling.

### File Location

- **HTML Section**: `index.html` lines 520-582 (Vision Test Section)
- **JavaScript Module**: `vision-test.js` (separate file)
- **CSS Styles**: `styles.css` lines 598-730 (Vision Test Section Styles)
- **Vision Chart**: `assets/images/table-ru.svg` (Russian Snellen chart with 7 lines)

### How It Works

The vision test follows a structured flow with three states:

#### 1. **Initial State (Before Test Starts)**
- **Instruction Text**: "Try our interactive vision test. Sit 50cm from the screen. Cover one eye."
- **Control**: Single "Start Test" button
- **Chart Display**: Hidden
- **Indicators**: Hidden (line indicator and vision strength indicator)

#### 2. **Active Test State (During Test)**
- **Instruction Text**: "Can you read all characters?"
- **Controls**: Two buttons - "Yes" (advance to next line) and "Restart" (reset test)
- **Chart Display**: Visible, showing current line from the Snellen chart
- **Indicators**:
  - **Top Left**: Line indicator (e.g., "Line 1 of 7", "Line 2 of 7", etc.)
  - **Top Right**: Vision strength indicator (e.g., "V = 0,1", "V = 0,2", etc.)

#### 3. **Completion State (After All 7 Lines)**
- **Instruction Text**: "Test complete! Your vision reaches [final vision value]. Please consult with Dr. Karimova for professional assessment."
- **Controls**: Only "Restart" button visible
- **Chart Display**: Remains visible on final line
- **Disclaimer**: Always visible at bottom - "This test is for educational purposes only and does not replace a professional eye examination."

### Vision Chart Data

The vision test uses **12 progressively smaller lines** from the Russian Snellen chart, covering the full range from V=0.1 to V=2.0:

| Line | Vision Value | Diopter Value | Description |
|------|--------------|---------------|-------------|
| 1    | V = 0,1      | D = 50,0      | Largest (very poor vision) |
| 2    | V = 0,2      | D = 25,0      | |
| 3    | V = 0,3      | D = 16,67     | |
| 4    | V = 0,4      | D = 12,5      | |
| 5    | V = 0,5      | D = 10,0      | |
| 6    | V = 0,6      | D = 8,33      | |
| 7    | V = 0,7      | D = 7,14      | |
| 8    | V = 0,8      | D = 6,25      | |
| 9    | V = 0,9      | D = 5,55      | |
| 10   | V = 1,0      | D = 5,0       | Normal vision |
| 11   | V = 1,5      | D = 3,33      | Above average vision |
| 12   | V = 2,0      | D = 2,5       | Excellent vision (smallest line) |

These values are hardcoded in `vision-test.js` in the `VISION_TEST_CONFIG` object.

### JavaScript Architecture (vision-test.js)

The vision test is implemented as an **IIFE (Immediately Invoked Function Expression)** to prevent global namespace pollution:

```javascript
(function() {
    'use strict';
    // Vision test logic here
})();
```

#### Key Functions:

1. **`initVisionTest()`** - Main initialization function, called on DOM ready
   - Checks if `#vision-test` section exists in DOM
   - Attaches event listeners to all buttons
   - Sets up initial UI state

2. **`startTest()`** - Triggered when "Start Test" button is clicked
   - Sets `currentLine = 1`
   - Shows chart and indicators
   - Hides initial controls, shows test controls
   - Updates instruction text

3. **`nextLine()`** - Triggered when "Yes" button is clicked
   - Increments `currentLine`
   - Updates indicators with new line/vision values
   - Calls `updateTestDisplay()` to refresh UI
   - If `currentLine > 7`, calls `showCompletionMessage()`

4. **`resetTest()`** - Triggered when "Restart" button is clicked
   - Resets `currentLine = 0`
   - Hides chart and indicators
   - Shows initial controls, hides test controls
   - Resets instruction text to initial state

5. **`updateTestDisplay()`** - Updates UI based on current line
   - Updates line indicator text (e.g., "Line 3 of 7")
   - Updates vision indicator text (e.g., "V = 0,3")
   - Sets `data-current-line` attribute on chart image for CSS targeting

6. **`updateChartDisplay(lineNumber)`** - Handles chart visualization
   - Sets `data-current-line` attribute for CSS-based animations
   - Future enhancement could implement SVG cropping/highlighting

7. **`showCompletionMessage()`** - Displays completion state
   - Shows final vision value in instruction text
   - Hides "Yes" button, keeps "Restart" button

#### Public API:

The module exposes a global `window.VisionTest` object with:
- `init()` - Manually initialize the test
- `isActive()` - Returns boolean of test active state
- `getCurrentLine()` - Returns current line number (0-12)

### CSS Styling (styles.css)

The vision test styles are organized in a dedicated section (lines 598-730):

#### Container Styles:
- `.vision-test-container` - Main container with relative positioning
- `.vision-chart-container` - Chart display area with gradient background

#### Chart Animation:
- Uses `data-current-line` attribute selector to apply progressive transformations
- Each line gets unique `translateY()` and `scale()` values
- Example: `[data-current-line="3"]` → `translateY(-100px) scale(1.4)`

#### Indicator Styles:
- `#line-indicator` - Gray, uppercase, tracking-widest
- `#vision-indicator` - Coral color with light background badge

#### Responsive Design:
- Mobile breakpoint at 768px
- Chart height reduced on mobile (350px vs 500px)
- Button widths adjusted for smaller screens

#### Accessibility:
- Focus-visible outlines on buttons (3px solid coral)
- Smooth transitions for state changes
- Completion state uses green color (#059669)

### Enabling/Disabling the Feature

The vision test is designed as a **modular, optional feature**. To enable/disable:

#### To Disable:
1. **Option A (Remove from DOM)**: Comment out or delete the Vision Test HTML section in `index.html` (lines 520-582)
2. **Option B (Remove script)**: Comment out or remove `<script src="vision-test.js"></script>` in `index.html` (line 706)
3. **Option C (Hide with CSS)**: Add `#vision-test { display: none; }` to `styles.css`

#### To Re-enable:
1. Ensure HTML section is present in `index.html`
2. Ensure `<script src="vision-test.js"></script>` is included before `</body>`
3. Ensure vision test styles are present in `styles.css`
4. Ensure `assets/images/table-ru.svg` exists

### Testing the Vision Test

When testing this feature:

1. **Initial State**: Verify "Start Test" button appears and instruction text is correct
2. **State Transitions**: Click through all 12 lines, verify indicators update correctly
3. **Vision Range**: Test covers from V=0.1 (poor vision) to V=2.0 (excellent vision)
4. **Font Sizes**: Verify progressive size reduction from 120px down to 12px
5. **Completion**: Ensure completion message appears after line 12 showing V=2.0
6. **Restart**: Verify "No" button resets to initial state at any point
7. **Button Behavior**: Verify "Yes" button reappears after restart
8. **Responsive**: Test on mobile devices (chart should scale appropriately)
9. **Accessibility**: Test keyboard navigation (Tab, Enter, Escape)

### Future Enhancements

Potential improvements to the vision test feature:

1. **SVG Cropping**: Implement actual line-by-line cropping of the SVG instead of transform animations
2. **Multilingual Support**: Add English and Tajik vision charts (`table-en.svg`, `table-tj.svg`)
3. **Results Storage**: Store test results in localStorage or send to backend
4. **Progress Saving**: Allow users to pause and resume tests
5. **Timer Feature**: Add optional timer to measure reading speed
6. **Both Eyes Test**: Guide users through testing both eyes separately
7. **Email Results**: Allow users to email their results to themselves or the doctor
8. **Analytics**: Track completion rates and average vision scores

### Internationalization (i18n)

The vision test section includes `data-i18n` attributes for multilingual support:

- `visionTest.subtitle` → "Interactive Feature"
- `visionTest.title` → "Test Your Vision"
- `visionTest.initialInstruction` → Initial instruction text
- `visionTest.questionInstruction` → "Can you read all characters?"
- `visionTest.startButton` → "Start Test"
- `visionTest.yesButton` → "Yes"
- `visionTest.restartButton` → "Restart"
- `visionTest.completionMessage` → Completion message
- `visionTest.disclaimer` → Disclaimer text

These should be added to the site's translation files when implementing full i18n support.

### Medical Disclaimer

**IMPORTANT**: The vision test feature includes a prominent disclaimer stating:

> "This test is for educational purposes only and does not replace a professional eye examination."

This disclaimer is always visible and cannot be dismissed. The completion message also encourages users to "consult with Dr. Karimova for professional assessment."

### Security & Privacy

- No personal data is collected or stored
- No backend API calls are made
- All test logic runs entirely client-side
- No cookies or tracking for the vision test feature
- Chart is served as a static SVG asset