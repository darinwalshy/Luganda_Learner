const APP_PREFIX = 'luganda-learner-';
const CACHE_NAME = `${APP_PREFIX}v1.9-Offline-Fix`;
const REPO_NAME = '/Luganda_Learner';

const ASSETS = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/manifest.json`
];

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate event - Safely scopes deletions to ONLY this app's prefixes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key.startsWith(APP_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event: NETWORK FIRST with immediate cache fallback
self.addEventListener('fetch', (event) => {
  // Only intercept requests for our own application assets
  if (event.request.url.includes(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          // If found in cache, return it; otherwise try to match the root index
          return response || caches.match(`${REPO_NAME}/index.html`);
        });
      })
    );
  }
});
