// Service Worker for Tahi Kalahi PWA
// Version: 3.0 (Updated to include data.json)

const CACHE_NAME = 'tahi-kalahi-cache-v3'; // IMPORTANT: Increment version number to force update

// List of all files that must be available offline
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './data.json', // CRITICAL: This ensures your stitches and damages load offline
    './manifest.json',
    './assets/icons/192.png',
    './assets/icons/512.png'
];

// Install Event: Download and cache all essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Opened cache:', CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('[SW] Failed to cache essential files:', error);
            })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the service worker takes control of all clients as soon as it's activated
    self.clients.claim();
});

// Fetch Event: Serve cached files when offline (Cache First Strategy)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return the cached version
                if (response) {
                    return response;
                }
                // Cache miss - fetch from network
                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response to cache it for next time
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});