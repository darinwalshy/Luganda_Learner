const CACHE_NAME = 'luganda-learner-v6'; // Matching your version numbering style
const ASSETS = [
  'index.html',
  'style.css',
  'app.js'
];

// Install event
self.addEventListener('install', (event) => {
  // Forces the waiting service worker to become the active service worker
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate event - Cleans up old caches automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event: NETWORK FIRST strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
