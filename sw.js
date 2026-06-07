const CACHE_NAME = 'luganda-learner-v1.2';

// Explicitly list the local assets we want to keep available offline
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

// 1. Install Event - Caches the core files right away
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app shell assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. Activate Event - Cleans up old caches if we update versions later
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache...');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. Fetch Event - Network-First Strategy (with Cache Fallback)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // Always try the network first to get the freshest live version
        fetch(event.request)
            .then((networkResponse) => {
                // If the network gives us a good response, cache a copy of it dynamically
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If the network is unavailable (offline), instantly fall back to the cache
                return caches.match(event.request);
            })
    );
});
