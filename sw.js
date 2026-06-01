// Service Worker for sitorakarimi.com
// Handles caching for offline support and performance optimization

// Cache version - INCREMENT THIS when deploying updates
// Format: 'v{major}.{minor}.{patch}'
const CACHE_VERSION = '1.4.0';
const CACHE_NAME = `sitorakarimi-${CACHE_VERSION}`;

// CSS version — must match the ?v= query string on /styles.css in index.njk.
// Update BOTH values whenever styles.css changes, then bump CACHE_VERSION.
const CSS_VERSION = '1.3.2';

// Tailwind version — must match the ?v= query string on /tailwind.css in all templates.
// Update BOTH values whenever tailwind.config.js or tailwind.input.css changes, then bump CACHE_VERSION.
const TAILWIND_VERSION = '1.3.1';

// Assets to cache. Per-locale pages are listed so offline visitors see their
// language correctly. Root "/" is intentionally omitted — it 302-redirects to /ru/.
// NOTE: styles.css is versioned (?v=CSS_VERSION) so that when the file changes
// and we bump CSS_VERSION, the new URL is fetched fresh instead of the SW
// serving a stale copy from the browser's HTTP cache.
const ASSETS_TO_CACHE = [
    '/ru/',
    '/tj/',
    '/en/',
    '/script.js',
    '/vision-test.js',
    '/vision-disorders.js',
    `/styles.css?v=${CSS_VERSION}`,
    '/favicon.svg',
    '/assets/images/hero.webp',
    '/assets/images/about-1.jpg',
    '/assets/images/about-1.webp',
    '/assets/images/about-2.webp',
    '/assets/images/about-2.jpg',
    '/assets/images/eyeglasses-vector-small.svg',
    '/assets/images/table-ru.svg',
    '/assets/images/og-image.webp',
    '/assets/images/vision-disorders.webp',
    '/blog/blog.css',
    '/blog/blog.js',
    '/ru/blog/',
    '/tj/blog/',
    '/en/blog/'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                // Use cache:'reload' so each fetch bypasses the browser's HTTP
                // cache and always pulls fresh bytes from the network.
                // Without this, cache.addAll() can store a stale response that
                // the browser's HTTP cache served (e.g. an old styles.css that
                // predates the glasses animation section), causing the SW to
                // serve that stale version on every subsequent language switch.
                const requests = ASSETS_TO_CACHE.map(
                    url => new Request(url, { cache: 'reload' })
                );
                return cache.addAll(requests);
            })
            .then(() => {
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches that don't match current version
                        if (cacheName !== CACHE_NAME && cacheName.startsWith('sitorakarimi-')) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - two strategies depending on resource type:
//
// HTML pages (locale pages like /ru/, /en/, /tj/):
//   Network-FIRST — always fetch fresh HTML from the server, fall back to
//   cache only when offline. This prevents stale-while-revalidate from
//   serving old HTML to language-switch navigations: the SW refreshes only
//   the page currently loaded; sibling locales can stay at their SW-install
//   vintage indefinitely under the old cache-first strategy.
//
// All other assets (JS, CSS, images, etc.):
//   Cache-FIRST — serve pre-cached assets instantly, fetch from network
//   only on a cache miss, and cache the result for future visits.
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (CDN, Google Tag Manager, etc.)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const isHTML = event.request.headers.get('accept') &&
                   event.request.headers.get('accept').includes('text/html');

    if (isHTML) {
        // ── Network-first for HTML ──────────────────────────────────────────
        // Locale pages are small static documents served from Netlify's CDN
        // edge — network round-trips are fast (< 100 ms on a good connection).
        // Always fetching fresh ensures language-switch navigations never see
        // a stale IIFE or stale markup.
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache the fresh response for offline fallback
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Offline: serve from cache; last resort falls back to the
                    // same locale the user was on, then /en/, then /ru/.
                    return caches.match(event.request)
                        .then((cached) => {
                            if (cached) return cached;
                            // Try to match the locale from the URL path (e.g. /en/, /ru/, /tj/)
                            const urlPath = new URL(event.request.url).pathname;
                            const localeMatch = urlPath.match(/^\/(en|ru|tj)\//);
                            const locale = localeMatch ? localeMatch[1] : 'en';
                            return caches.match(`/${locale}/`)
                                .then((localeFallback) => localeFallback || caches.match('/en/'));
                        });
                })
        );
    } else {
        // ── Cache-first for assets ──────────────────────────────────────────
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request)
                        .then((response) => {
                            if (!response || response.status !== 200 || response.type === 'error') {
                                return response;
                            }

                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                            return response;
                        })
                        .catch((error) => {
                            console.error('[Service Worker] Fetch failed:', error);
                            throw error;
                        });
                })
        );
    }
});

// Message event - allow clients to trigger cache refresh
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName.startsWith('sitorakarimi-')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    }
});
