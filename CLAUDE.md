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

### Version Management & Releases

When preparing a release or making significant updates to the site:

**IMPORTANT: Always increment the Service Worker cache version in `sw.js`:**

1. Open `sw.js` (Service Worker file)
2. Update the `CACHE_VERSION` constant on line 6
3. Follow semantic versioning (e.g., `1.0.1` → `1.0.2` for patches, `1.1.0` for features, `2.0.0` for breaking changes)
4. This ensures all users receive the latest version of cached assets

**Example:**
```javascript
// Before
const CACHE_VERSION = '1.0.1';

// After (patch release)
const CACHE_VERSION = '1.0.2';
```

**Why this matters:**
- The Service Worker caches static assets (HTML, CSS, JS) for offline support
- Without updating the version, users may see old cached content
- The new cache version forces all users to fetch fresh assets
- Old cache versions are automatically deleted on Service Worker activation

**When to increment:**
- Major content changes to `index.html`
- CSS updates in `styles.css`
- JavaScript changes in `script.js` or `vision-test.js`
- Before deploying to production
- When fixing bugs or adding features

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
- **Instruction Text**: "Can you read all characters?" - positioned at bottom of white box
- **Controls**: Three buttons
  - **"Yes"** (green) - Records positive result, advances to next line
  - **"No"** (outline) - Records negative result, advances to next line
  - **"Restart"** (outline, smaller) - Resets test at any time
- **Chart Display**: Single line of Cyrillic characters, centered in white box
- **Indicators** (inside white box, top corners):
  - **Top Left**: Line indicator (e.g., "LINE 1 OF 12", "LINE 2 OF 12", etc.)
  - **Top Right**: Vision strength indicator (e.g., "V = 0,1", "V = 0,2", etc.)

#### 3. **Completion State (After All 12 Lines)**
- **Display**: Results summary shown in chart area
  - "Test Complete!" heading
  - "Your vision level: V = X,X" (highest line successfully read)
  - Detailed results table with checkmarks (✓) and X marks (✗) for each line
  - Scrollable if more than ~8 lines
  - Professional consultation reminder
- **Controls**: Only "Restart" button visible
- **Instruction Text**: Hidden
- **Disclaimer**: Always visible at bottom - "This test is for educational purposes only and does not replace a professional eye examination."

### Vision Chart Data

The vision test uses **12 progressively smaller lines** of Russian Cyrillic characters, covering the full range from V=0.1 to V=2.0:

| Line | Vision Value | Diopter Value | Characters | Font Size | Description |
|------|--------------|---------------|------------|-----------|-------------|
| 1    | V = 0,1      | D = 50,0      | Ш Б        | 120px     | Largest (very poor vision) |
| 2    | V = 0,2      | D = 25,0      | М Н К      | 80px      | |
| 3    | V = 0,3      | D = 16,67     | Ы М Б Ш    | 60px      | |
| 4    | V = 0,4      | D = 12,5      | Б Ы Н К М  | 48px      | |
| 5    | V = 0,5      | D = 10,0      | И Н Ш М К  | 40px      | |
| 6    | V = 0,6      | D = 8,33      | Н Ш Ы И К Б | 32px     | |
| 7    | V = 0,7      | D = 7,14      | Ш И Н Б К Ы | 28px     | |
| 8    | V = 0,8      | D = 6,25      | К Н Ш М Ы Б И | 24px   | |
| 9    | V = 0,9      | D = 5,55      | Б К Ш М И Ы Н | 20px   | |
| 10   | V = 1,0      | D = 5,0       | Н К И Б М Ш Ы Б | 18px | Normal vision (20/20) |
| 11   | V = 1,5      | D = 3,33      | Ш И Н К М И Ы Б | 14px | Above average vision |
| 12   | V = 2,0      | D = 2,5       | И М Ш Ы Н Б М К | 12px | Excellent vision (smallest) |

These values are hardcoded in `vision-test.js` in the `VISION_TEST_CONFIG` object.

**Character Selection:**
Characters are selected from Russian Cyrillic optotypes commonly used in Snellen charts: Ш, Б, М, Н, К, Ы, И. These characters have similar visual complexity and are easily distinguishable at various sizes.

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
   - Attaches event listeners to all buttons (Start, Yes, No, Restart)
   - Sets up initial UI state

2. **`startTest()`** - Triggered when "Start Test" button is clicked
   - Sets `currentLine = 1`
   - Initializes `testResults = []` to track answers
   - Shows chart and indicators
   - Hides initial controls, shows test controls
   - Updates instruction text to "Can you read all characters?"

3. **`recordAnswer(canRead)`** - Triggered when "Yes" or "No" button is clicked
   - Stores result in `testResults` array with:
     - `line`: Current line number (1-12)
     - `vision`: Vision value (e.g., "V = 0,5")
     - `diopter`: Diopter value (e.g., "D = 10,0")
     - `canRead`: Boolean (true for Yes, false for No)
   - Increments `currentLine` and calls `updateTestDisplay()`
   - If `currentLine > 12`, calls `showCompletionMessage()`
   - **Does NOT reset test** - continues until all 12 lines are tested

4. **`resetTest()`** - Triggered when "Restart" button is clicked
   - Resets `currentLine = 0`
   - Clears `testResults = []`
   - Hides chart and indicators
   - Shows initial controls, hides test controls
   - Resets instruction text to initial state
   - Shows instruction text again (sets `display: 'block'`)

5. **`updateTestDisplay()`** - Updates UI based on current line
   - Updates line indicator text (e.g., "LINE 3 OF 12")
   - Updates vision indicator text (e.g., "V = 0,3")
   - Calls `updateChartDisplay(currentLine)` to render characters

6. **`updateChartDisplay(lineNumber)`** - Renders current line of characters
   - Gets character array for current line from `VISION_TEST_CONFIG.lineCharacters`
   - Gets font size from `VISION_TEST_CONFIG.fontSizes`
   - Dynamically generates HTML with:
     - `.vision-line` div with appropriate font size
     - Individual `.vision-char` spans for each character
     - Characters spaced with `gap: 0.3em` (CSS flexbox)
   - Replaces `#vision-chart` innerHTML with rendered line

7. **`showCompletionMessage()`** - Displays results summary
   - Analyzes `testResults` to find best vision (last "Yes" answer)
   - If no "Yes" answers, shows "Below V = 0,1"
   - Generates HTML summary with:
     - "Test Complete!" heading (centered)
     - Best vision level achieved
     - Detailed results table (scrollable)
     - Each line shows: Line number, vision value, checkmark (✓) or X (✗)
     - Professional consultation reminder
   - Hides instruction text (sets `display: 'none'`)
   - Hides Yes and No buttons (only Restart visible)

#### Public API:

The module exposes a global `window.VisionTest` object with:
- `init()` - Manually initialize the test
- `isActive()` - Returns boolean of test active state
- `getCurrentLine()` - Returns current line number (0-12)

### CSS Styling (styles.css)

The vision test styles are organized in a dedicated section (lines 631-860+):

#### Container Styles:
- `.vision-test-container` - Main gray container with compact padding
  - Desktop: `p-8` (32px)
  - Mobile: `p-4` (16px)
- `.vision-chart-container` - White box with gradient background, contains chart and indicators
  - Height: `min-h-[400px]` (desktop), `min-h-[350px]` → `280px` (mobile)
  - Uses `flexbox` with `flex-col` for vertical layout
  - `position: relative` for absolute-positioned indicators

#### Layout Structure:
```
.vision-test-container (gray background)
  └── .vision-chart-container (white box)
        ├── .vision-indicators-row (absolute, top corners)
        │     ├── #line-indicator (top-left)
        │     └── #vision-indicator (top-right)
        ├── #vision-chart (centered, flex-1)
        │     └── .vision-line (dynamic characters)
        └── .vision-instruction-bottom (absolute, bottom)
              └── #vision-instruction
```

#### Character Display:
- `.vision-chart` - Flexbox container with reduced padding
  - Desktop: `padding: 20px`
  - Mobile: `padding: 10px`
  - Uses `flex items-center justify-center` for centering
- `.vision-line` - Character line wrapper
  - `display: flex` with `justify-content: center`
  - `gap: 0.3em` (desktop), `0.2em` (mobile)
  - Font size set inline (12px-120px)
  - Fade-in animation on render
- `.vision-char` - Individual character spans
  - `display: inline-block` for proper spacing
  - Centered with flexbox parent

#### Indicator Styles:
- `#line-indicator` - Top-left corner
  - Font: 0.75rem, uppercase, tracking-widest
  - Color: Gray (#6b7280)
  - Background: Semi-transparent white (rgba(255, 255, 255, 0.95))
  - Padding: 4px 8px
  - **No shadow** (removed for flat design)
- `#vision-indicator` - Top-right corner
  - Font: 0.875rem (14px)
  - Color: Coral (#ff6b4a)
  - Same background and padding as line indicator
  - **No shadow**

#### Instruction Text:
- `#vision-instruction` - Bottom of white box
  - Position: Absolute at bottom
  - Background: Semi-transparent white
  - Padding: 8px 12px
  - Font: 0.875rem (mobile), 1rem (desktop)
  - **No shadow**
  - Hidden on completion with `display: none`

#### Button Styles:
- `.btn-green` - "Yes" button
  - Background: #059669 (green)
  - Hover: #047857 (darker green)
  - Lift effect on hover: `translateY(-2px)`
  - Mobile: Smaller padding (12px 32px)
- `.btn-outline` - "No" and "Restart" buttons
  - Standard outline style (navy border)
  - Mobile: Smaller padding
- Button layout:
  - Desktop: Side by side with gap-4
  - Mobile: Full width, stacked vertically

#### Results Summary Styles:
- `.vision-results-summary` - Results container
  - Max-width: 600px
  - Centered with auto margins
  - Top padding: `pt-6` (24px desktop), `1.5rem` (mobile)
  - Compact padding overall: 10px (desktop), 5px (mobile)
- `.results-details` - Scrollable results table
  - White background with rounded corners
  - Shadow: `0 2px 8px rgba(0, 0, 0, 0.1)`
  - Max height: 256px (scrollable if needed)
  - Right padding: `pr-2` to separate from scrollbar
- Result rows:
  - Spacing: `space-y-1` (4px between rows)
  - Row padding: `py-1.5` (6px vertical)
  - Right padding: `pr-1` (4px) - prevents checkmarks touching scrollbar
  - Border bottom for separation
- Scrollbar styling:
  - Width: 6px
  - Track: Light gray (#f1f1f1)
  - Thumb: Gray (#d1d5db), darker on hover

#### Mobile Responsiveness:
All major elements are optimized for mobile at 768px breakpoint:
- Reduced container padding (32px → 16px)
- Smaller white box height (400px → 280px)
- Compact chart padding (20px → 10px)
- Smaller font sizes for indicators (0.75rem → 0.65rem)
- Smaller instruction text (1rem → 0.875rem)
- Reduced character gap (0.3em → 0.2em)
- Stacked button layout (flex-col)
- Full-width buttons
- Smaller result heading (1.5rem → 1rem)
- Compact results padding

#### Accessibility:
- No focus outlines on buttons (removed shadows for cleaner look)
- Smooth transitions for all state changes (0.3s ease)
- Fade-in animation for character appearance
- High contrast text (black on white for characters)
- Semantic HTML structure maintained
- Responsive text sizing for readability

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

1. **Initial State**:
   - Verify "Start Test" button appears
   - Instruction text: "Try our interactive vision test. Sit 50cm from the screen. Cover one eye."
   - Chart and indicators are hidden

2. **Starting the Test**:
   - Click "Start Test"
   - Instruction moves to bottom of white box: "Can you read all characters?"
   - First line (Ш Б) appears centered at 120px
   - Line indicator shows "LINE 1 OF 12" (top-left)
   - Vision indicator shows "V = 0,1" (top-right)
   - Three buttons visible: Yes (green), No (outline), Restart (smaller outline)

3. **Answer Recording**:
   - Click "Yes" → Records positive result, moves to line 2
   - Click "No" → Records negative result, moves to line 2
   - Both buttons advance the test (do not end it)
   - Click "Restart" → Resets test to initial state at any time

4. **Progression Through Lines**:
   - Each line shows progressively smaller characters
   - Line indicator updates: "LINE 2 OF 12", "LINE 3 OF 12", etc.
   - Vision indicator updates: "V = 0,2", "V = 0,3", etc.
   - Characters properly centered with appropriate spacing
   - Font sizes: 120px → 80px → 60px → 48px → 40px → 32px → 28px → 24px → 20px → 18px → 14px → 12px

5. **Completion State**:
   - After line 12, results summary appears
   - "Test Complete!" heading (centered, compact)
   - "Your vision level: V = X,X" (shows highest line successfully read)
   - Detailed results table with ✓ for "Yes" answers, ✗ for "No" answers
   - If more than 8 lines, table is scrollable
   - Checkmarks have proper spacing from scrollbar (pr-1, pr-2)
   - Only "Restart" button visible
   - Instruction text hidden
   - Professional consultation reminder at bottom

6. **Results Calculation**:
   - Best vision = last line where user clicked "Yes"
   - If all "No" answers → "Below V = 0,1"
   - If user clicks "Yes" through line 10 → "V = 1,0"
   - Results persist until restart

7. **Restart Functionality**:
   - Click "Restart" from any state
   - Clears all results
   - Returns to initial state
   - Yes and No buttons reappear
   - Instruction text reappears at bottom

8. **Visual/Layout Checks**:
   - Characters centered in white box
   - Indicators inside white box corners (not gray area)
   - Instruction at bottom of white box (not outside)
   - No overlapping text (indicators clear of "Test Complete!" heading)
   - No shadows on indicators or instruction tooltips
   - Smooth fade-in animation when characters appear

9. **Mobile Responsiveness**:
   - Test on screen width < 768px
   - White box height: 280px (compact)
   - Buttons stack vertically, full width
   - Smaller font sizes for all elements
   - Character gap reduced to 0.2em
   - Results heading: 1rem
   - Proper spacing maintained

10. **Button Styling**:
    - Yes button: Green (#059669) with hover lift effect
    - No button: Navy outline
    - Restart button: Navy outline, slightly smaller
    - All buttons have hover effects

11. **Accessibility**:
    - Tab through buttons (keyboard navigation)
    - Enter key activates buttons
    - High contrast (black text on white for characters)
    - Readable font sizes at all levels

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