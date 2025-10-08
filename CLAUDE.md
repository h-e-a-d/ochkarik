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

- `index.html` - Main single-page application with all sections (hero, services, about, testimonials, contact, footer)
- `script.js` - All interactive functionality and animations
- `styles.css` - Custom CSS for animations, transitions, and design enhancements
- `website.png` - Reference design file (6MB PNG for UX/UI reference)

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

1. **Navigation** (lines 39-70) - Fixed navbar with mobile menu
2. **Hero** (lines 73-105) - Full-screen with background image and gradient overlay
3. **Services** (lines 108-171) - 6 service cards in grid layout on navy background
4. **About** (lines 174-215) - Two-column layout with text and image
5. **Stats Circle** (lines 218-231) - Single centered circle with "15+ Years" stat
6. **Testimonials** (lines 234-261) - Large quote with star rating
7. **Partners** (lines 264-290) - Icon grid (placeholder logos)
8. **Contact** (lines 293-361) - Google Maps iframe with overlay card + contact info
9. **Footer** (lines 364-419) - 4-column layout with links and social icons

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