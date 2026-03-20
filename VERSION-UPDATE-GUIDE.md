# Version Update Guide

This guide explains how to force users to get the latest version of your website whenever you make updates.

## Quick Start - Updating Your Site

**Every time you update your website content, CSS, or JavaScript, follow this simple step:**

### Update the Version Number in sw.js

Open `sw.js` and change the `CACHE_VERSION` on line 6:

```javascript
// Change from:
const CACHE_VERSION = '1.0.0';

// To (example):
const CACHE_VERSION = '1.0.1';  // or 1.1.0, 2.0.0, etc.
```

**That's it!** The service worker will force all users to download fresh files.

### Deploy Your Changes

Upload all updated files to your server:
- `index.html`
- `sw.js`
- `styles.css` (if modified)
- `script.js` (if modified)
- `vision-test.js` (if modified)

### 4. Clear Your Browser Cache (First Time Only)

After deployment, to test the changes:
- **Chrome/Edge**: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- **Or**: Right-click → Inspect → Application tab → Clear storage → "Clear site data"

## What Was Implemented

### 1. Service Worker Cache Management (sw.js)
The version is defined in `sw.js`:
```javascript
const CACHE_VERSION = '1.0.0';  // <-- Update this to force cache refresh
const CACHE_NAME = `sitora-karimova-v${CACHE_VERSION}`;
```

When you change this version:
- Service worker creates a NEW cache with the new version number
- Old cache is automatically deleted
- All files are re-downloaded fresh from the server

### 2. Cache-Control Meta Tags (index.html)
Tells browsers not to cache the HTML file:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### 3. Smart Caching Strategies (sw.js)
- **Network First** for HTML files → Always fresh from server
- **Stale-While-Revalidate** for CSS/JS → Fast delivery, updates in background
- Only caches GET requests (ignores POST/PUT/DELETE)
- Skips external resources (CDNs, Google Analytics, etc.)

### 4. Auto-Update Notification
When a new version is detected, users see a popup:
> "A new version is available! Click OK to update."

Clicking OK reloads the page with the latest version.

## How It Works

1. User visits your site → HTML loads (never cached due to meta tags)
2. Service worker activates with cache name `sitora-karimova-v1.0.0`
3. CSS/JS files are cached for fast loading
4. **When you update `CACHE_VERSION` to `1.0.1`:**
   - New cache `sitora-karimova-v1.0.1` is created
   - All files are re-downloaded fresh
   - Old cache `sitora-karimova-v1.0.0` is deleted
5. User gets the latest version automatically!

**Simple:** Just increment ONE version number in `sw.js`!

## Version Numbering Best Practices

Use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** (1.0.0 → 2.0.0): Major redesign or breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features or sections added
- **PATCH** (1.0.0 → 1.0.1): Bug fixes or small content updates

Examples:
- Fixed a typo: `1.0.0` → `1.0.1`
- Added new service: `1.0.1` → `1.1.0`
- Complete redesign: `1.5.3` → `2.0.0`

## Troubleshooting

### Users Still See Old Version

**Solution 1: Check version number**
- Verify `CACHE_VERSION` in `sw.js` was incremented
- Ensure updated files are on the server (especially `sw.js`)

**Solution 2: Force cache clear**
- Add this to your browser console: `caches.keys().then(keys => keys.forEach(key => caches.delete(key)))`
- Or: Shift+F5 (hard refresh)

**Solution 3: Unregister old service worker**
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```
Then refresh the page.

### Service Worker Not Working

Check browser console (F12) for errors. Common issues:
- **HTTPS required**: Service workers only work on `https://` or `localhost`
- **File path**: Ensure `sw.js` is in the root directory
- **Permissions**: Check browser settings allow service workers

## Testing Updates

1. **Before deploying:**
   - Test locally with `python -m http.server 8000`
   - Open in incognito mode
   - Verify changes appear

2. **After deploying:**
   - Open site in new incognito window (bypasses all caches)
   - Check browser console for "Service Worker registered successfully"
   - Make a small change and increment version to test auto-update

## Advanced: Automating Version Bumps

To automatically increment versions, create `bump-version.sh`:

```bash
#!/bin/bash
# Usage: ./bump-version.sh [major|minor|patch]

TYPE=${1:-patch}  # Default to patch

# Read current version from sw.js
CURRENT=$(grep "CACHE_VERSION = " sw.js | sed -E "s/.*'([0-9.]+)'.*/\1/")

# Split into major.minor.patch
IFS='.' read -r -a VERSION <<< "$CURRENT"
MAJOR=${VERSION[0]}
MINOR=${VERSION[1]}
PATCH=${VERSION[2]}

# Increment based on type
if [ "$TYPE" == "major" ]; then
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
elif [ "$TYPE" == "minor" ]; then
    MINOR=$((MINOR + 1))
    PATCH=0
else
    PATCH=$((PATCH + 1))
fi

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Update sw.js
sed -i "s/const CACHE_VERSION = '.*'/const CACHE_VERSION = '$NEW_VERSION'/g" sw.js

echo "Version updated: $CURRENT → $NEW_VERSION"
```

Make executable: `chmod +x bump-version.sh`

Run:
- `./bump-version.sh` (increments 1.0.0 → 1.0.1)
- `./bump-version.sh minor` (increments 1.0.5 → 1.1.0)
- `./bump-version.sh major` (increments 1.5.3 → 2.0.0)

## Summary

✅ **Cache-control headers** prevent HTML caching
✅ **Version query parameters** force CSS/JS reloads
✅ **Service Worker** manages cache lifecycle
✅ **Auto-update popup** notifies users of new versions

**Remember:** Increment `CACHE_VERSION` in `sw.js` after every site update!
