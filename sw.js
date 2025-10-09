// Service Worker for Sitora Karimova Ophthalmology Website
// Provides offline support and caching for better performance

// IMPORTANT: Increment this version number whenever you update the site
// This will force all users to get the new version
const CACHE_VERSION = '1.0.2';
const CACHE_NAME = `sitora-karimova-v${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  `/styles.css?v=${CACHE_VERSION}`,
  `/script.js?v=${CACHE_VERSION}`,
  `/vision-test.js?v=${CACHE_VERSION}`
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch from cache, fallback to network
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip caching for external CDN resources and Google Analytics
  if (event.request.url.startsWith('https://cdn.') ||
      event.request.url.startsWith('https://cdnjs.') ||
      event.request.url.startsWith('https://www.google-analytics.') ||
      event.request.url.startsWith('https://www.googletagmanager.') ||
      event.request.url.includes('google') ||
      event.request.url.includes('analytics')) {
    return;
  }

  // Use Network First strategy for HTML files to ensure fresh content
  if (event.request.url.includes('.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Use Cache First strategy for CSS, JS, and images
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - but also fetch in background to update cache
        if (response) {
          // Update cache in background
          fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse);
              });
            }
          });
          return response;
        }

        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
