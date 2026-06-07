const CACHE_NAME = 'luganda-learner-v2';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

// 1. Install Event - Caches assets and forces the worker to skip the waiting room
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Force the waiting service worker to become the active service worker immediately
    self.skipWaiting();
});

// 2. Activate Event - Cleans up old caches and forcefully takes control of the page
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
    // Forcefully take control of all open tabs right now
    return self.clients.claim();
});

// 3. Fetch Event - Always checks the network first for updates, falls back to cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If network is successful, update the cache with the shiny new files
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If network fails (offline), pull instantly from local cache
                return caches.match(event.request);
            })
    );
});
