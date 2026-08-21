// Service Worker for Tahi Kalahi PWA
const CACHE_NAME = 'tahi-kalahi-cache-v7';

// All files to pre-cache for offline use
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './data.json',
    './manifest.json',
    './assets/icons/192.png',
    './assets/icons/512.png',
    
    // Stitch Pattern Images
    'assets/images/RunningS/running_pattern.webp',
    'assets/images/BackS/back_pattern.webp',
    'assets/images/WhipS/whip_pattern.webp',
    'assets/images/CatchS/catch_pattern.webp',
    'assets/images/LadderS/ladder_pattern.webp',
    
    // Running Stitch Steps
    'assets/images/RunningS/running1.webp',
    'assets/images/RunningS/running2.webp',
    'assets/images/RunningS/running3.webp',
    'assets/images/RunningS/running4.webp',
    'assets/images/RunningS/running5.webp',
    'assets/images/RunningS/running6.webp',
    'assets/images/RunningS/running7.webp',
    'assets/images/RunningS/running8.webp',
    'assets/images/RunningS/running9.webp',
    'assets/images/RunningS/running10.webp',
    'assets/images/RunningS/running11.webp',
    'assets/images/RunningS/running12.webp',
    
    // Backstitch Steps
    'assets/images/BackS/back1.webp',
    'assets/images/BackS/back2.webp',
    'assets/images/BackS/back3.webp',
    'assets/images/BackS/back4.webp',
    'assets/images/BackS/back5.webp',
    'assets/images/BackS/back6.webp',
    'assets/images/BackS/back7.webp',
    'assets/images/BackS/back8.webp',
    'assets/images/BackS/back9.webp',
    'assets/images/BackS/back10.webp',
    'assets/images/BackS/back11.webp',
    'assets/images/BackS/back12.webp',
    'assets/images/BackS/back13.webp',
    'assets/images/BackS/back14.webp',
    'assets/images/BackS/back15.webp',
    'assets/images/BackS/back16.webp',
    
    // Whip Stitch Steps
    'assets/images/WhipS/whip1.webp',
    'assets/images/WhipS/whip2.webp',
    'assets/images/WhipS/whip3.webp',
    'assets/images/WhipS/whip4.webp',
    'assets/images/WhipS/whip5.webp',
    'assets/images/WhipS/whip6.webp',
    'assets/images/WhipS/whip7.webp',
    'assets/images/WhipS/whip8.webp',
    'assets/images/WhipS/whip9.webp',
    'assets/images/WhipS/whip10.webp',
    'assets/images/WhipS/whip11.webp',
    
    // Catch Stitch Steps
    'assets/images/CatchS/catch1.webp',
    'assets/images/CatchS/catch2.webp',
    'assets/images/CatchS/catch3.webp',
    'assets/images/CatchS/catch4.webp',
    'assets/images/CatchS/catch5.webp',
    'assets/images/CatchS/catch6.webp',
    'assets/images/CatchS/catch7.webp',
    'assets/images/CatchS/catch8.webp',
    'assets/images/CatchS/catch9.webp',
    'assets/images/CatchS/catch10.webp',
    'assets/images/CatchS/catch11.webp',
    'assets/images/CatchS/catch12.webp',
    'assets/images/CatchS/catch13.webp',
    'assets/images/CatchS/catch14.webp',
    'assets/images/CatchS/catch15.webp',
    
    // Ladder Stitch Steps
    'assets/images/LadderS/ladder1.webp',
    'assets/images/LadderS/ladder2.webp',
    'assets/images/LadderS/ladder3.webp',
    'assets/images/LadderS/ladder4.webp',
    'assets/images/LadderS/ladder5.webp',
    'assets/images/LadderS/ladder6.webp',
    'assets/images/LadderS/ladder7.webp',
    'assets/images/LadderS/ladder8.webp',
    'assets/images/LadderS/ladder9.webp',
    'assets/images/LadderS/ladder10.webp',
    'assets/images/LadderS/ladder11.webp',
    'assets/images/LadderS/ladder12.webp',
    'assets/images/LadderS/ladder13.webp',
    'assets/images/LadderS/ladder14.webp',
    'assets/images/LadderS/ladder15.webp',
    
    // Damage Images - Whip Torn Edges
    'assets/images/Whip_dmg/whip_torn_edges.webp',
    'assets/images/Whip_dmg/whip_torn_edges1.webp',
    'assets/images/Whip_dmg/whip_torn_edges2.webp',
    'assets/images/Whip_dmg/whip_torn_edges3.webp',
    'assets/images/Whip_dmg/whip_torn_edges4.webp',
    'assets/images/Whip_dmg/whip_torn_edges5.webp',
    'assets/images/Whip_dmg/whip_torn_edges6.webp',
    'assets/images/Whip_dmg/whip_torn_edges7.webp',
    'assets/images/Whip_dmg/whip_torn_edges8.webp',
    'assets/images/Whip_dmg/whip_torn_edges9.webp',
    'assets/images/Whip_dmg/whip_torn_edges10.webp',
    'assets/images/Whip_dmg/whip_torn_edges11.webp',
    'assets/images/Whip_dmg/whip_torn_edges12.webp',
    
    // Damage Images - Running Patches
    'assets/images/Running_dmg/running_patches.webp',
    'assets/images/Running_dmg/running_patches1.webp',
    'assets/images/Running_dmg/running_patches2.webp',
    'assets/images/Running_dmg/running_patches3.webp',
    'assets/images/Running_dmg/running_patches4.webp',
    'assets/images/Running_dmg/running_patches5.webp',
    'assets/images/Running_dmg/running_patches6.webp',
    'assets/images/Running_dmg/running_patches7.webp',
    'assets/images/Running_dmg/running_patches8.webp',
    'assets/images/Running_dmg/running_patches9.webp',
    'assets/images/Running_dmg/running_patches10.webp',
    'assets/images/Running_dmg/running_patches11.webp',
    'assets/images/Running_dmg/running_patches12.webp',
    
    // Damage Images - Catch Split
    'assets/images/Catch_dmg/catch_split.webp',
    'assets/images/Catch_dmg/catch_split1.webp',
    'assets/images/Catch_dmg/catch_split2.webp',
    'assets/images/Catch_dmg/catch_split3.webp',
    'assets/images/Catch_dmg/catch_split4.webp',
    'assets/images/Catch_dmg/catch_split5.webp',
    'assets/images/Catch_dmg/catch_split6.webp',
    'assets/images/Catch_dmg/catch_split7.webp',
    'assets/images/Catch_dmg/catch_split8.webp',
    'assets/images/Catch_dmg/catch_split9.webp',
    'assets/images/Catch_dmg/catch_split10.webp',
    'assets/images/Catch_dmg/catch_split11.webp',
    'assets/images/Catch_dmg/catch_split12.webp',
    'assets/images/Catch_dmg/catch_split13.webp',
    'assets/images/Catch_dmg/catch_split14.webp',
    'assets/images/Catch_dmg/catch_split15.webp'
];

// Install Event: Pre-cache all files
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Opened cache:', CACHE_NAME);
                console.log('[SW] Caching', urlsToCache.length, 'files...');
                return cache.addAll(urlsToCache.map(url => {
                    return new Request(url, { mode: 'no-cors' });
                })).catch(err => {
                    console.log('[SW] Some files failed to cache, but continuing...', err);
                });
            })
            .then(() => {
                console.log('[SW] Installation complete, skipping waiting phase');
                return self.skipWaiting();
            })
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
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
        }).then(() => {
            console.log('[SW] Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch Event: Cache-first strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return response;
                }
                
                // Try to fetch from network
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        
                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        console.log('[SW] Network request failed, serving offline fallback');
                        if (event.request.destination === 'image') {
                            return caches.match('./assets/icons/192.png');
                        }
                        return caches.match('./index.html');
                    });
            })
    );
});