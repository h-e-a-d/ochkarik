// Service Worker for sitorakarimi.com
// Handles caching for offline support and performance optimization

// Cache version - INCREMENT THIS when deploying updates
// Format: 'v{major}.{minor}.{patch}'
const CACHE_VERSION = '1.0.6'; // Added internal linking for SEO and navigation
const CACHE_NAME = `sitorakarimi-${CACHE_VERSION}`;

// Assets to cache
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/script.js',
    '/vision-test.js',
    '/styles.css',
    '/favicon.svg',
    '/assets/images/hero.png',
    '/assets/images/about-1.jpg',
    '/assets/images/about-2.jpg',
    '/assets/images/table-ru.svg',
    '/assets/images/og-image.webp'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests (CDN, Google Tag Manager, etc.)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    // For HTML, also fetch from network in background to update cache
                    if (event.request.headers.get('accept').includes('text/html')) {
                        event.waitUntil(
                            fetch(event.request)
                                .then((response) => {
                                    return caches.open(CACHE_NAME).then((cache) => {
                                        cache.put(event.request, response.clone());
                                        return response;
                                    });
                                })
                                .catch(() => {
                                    // Network failed, keep using cache
                                })
                        );
                    }

                    return cachedResponse;
                }

                // If not in cache, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response before caching
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Fetch failed:', error);

                        // Return offline page if available
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/');
                        }

                        // For other resources, just fail
                        throw error;
                    });
            })
    );
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
