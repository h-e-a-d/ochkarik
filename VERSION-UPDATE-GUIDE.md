# Version Update Guide

This guide explains how to force users to get the latest version of your website whenever you make updates.

## Quick Start - Updating Your Site

**Every time you update your website content, CSS, or JavaScript, follow these steps:**

### 1. Update the Version Number

Open `sw.js` and change the `CACHE_VERSION` on line 6:

```javascript
// Change from:
const CACHE_VERSION = '1.0.0';

// To (example):
const CACHE_VERSION = '1.0.1';  // or 1.1.0, 2.0.0, etc.
```

### 2. Update Version in index.html

Open `index.html` and update the version numbers on these lines:

- Line ~73: `<link rel="stylesheet" href="styles.css?v=1.0.1">`
- Line ~714: `<script src="script.js?v=1.0.1"></script>`
- Line ~715: `<script src="vision-test.js?v=1.0.1"></script>`
- Line ~720: `navigator.serviceWorker.register('/sw.js?v=1.0.1')`

**Replace `1.0.1` with your new version number** (should match `sw.js`).

### 3. Deploy Your Changes

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

### 1. Cache-Control Meta Tags (index.html)
Tells browsers not to cache the HTML file:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### 2. Version Query Parameters
All CSS/JS files now have `?v=X.X.X` appended:
- `styles.css?v=1.0.0`
- `script.js?v=1.0.0`
- `vision-test.js?v=1.0.0`

**Why this works:** Browsers treat `file.js?v=1.0.0` and `file.js?v=1.0.1` as different files, forcing a fresh download.

### 3. Service Worker Cache Management (sw.js)
- Uses versioned cache names: `sitora-karimova-v1.0.0`
- Automatically deletes old caches when version changes
- Uses **Network First** strategy for HTML (always fresh)
- Uses **Stale-While-Revalidate** for CSS/JS (fast, but updates in background)

### 4. Auto-Update Notification
When a new version is detected, users see a popup:
> "A new version is available! Click OK to update."

Clicking OK reloads the page with the latest version.

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

**Solution 1: Check version numbers**
- Verify `CACHE_VERSION` in `sw.js` was incremented
- Verify all `?v=X.X.X` in `index.html` match the new version
- Ensure updated files are on the server

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

## Advanced: Automating Version Updates

To avoid manual updates, you can use a build script. Create `update-version.sh`:

```bash
#!/bin/bash
# Usage: ./update-version.sh 1.0.1

NEW_VERSION=$1

# Update sw.js
sed -i "s/const CACHE_VERSION = '.*'/const CACHE_VERSION = '$NEW_VERSION'/g" sw.js

# Update index.html
sed -i "s/styles.css?v=[0-9.]\+/styles.css?v=$NEW_VERSION/g" index.html
sed -i "s/script.js?v=[0-9.]\+/script.js?v=$NEW_VERSION/g" index.html
sed -i "s/vision-test.js?v=[0-9.]\+/vision-test.js?v=$NEW_VERSION/g" index.html
sed -i "s/sw.js?v=[0-9.]\+/sw.js?v=$NEW_VERSION/g" index.html

echo "Updated to version $NEW_VERSION"
```

Make executable: `chmod +x update-version.sh`

Run: `./update-version.sh 1.0.2`

## Summary

✅ **Cache-control headers** prevent HTML caching
✅ **Version query parameters** force CSS/JS reloads
✅ **Service Worker** manages cache lifecycle
✅ **Auto-update popup** notifies users of new versions

**Remember:** Increment `CACHE_VERSION` in `sw.js` after every site update!
