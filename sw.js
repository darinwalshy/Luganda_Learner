// ==========================================
// 🛠️ UNIQUE IDENTIFIERS FOR THIS APP
// ==========================================
const APP_PREFIX = 'luganda_learner_v3.3_'; // Strict system naming rule
const CACHE_NAME = APP_PREFIX + 'cache';
const REPO_NAME = '/Luganda_Learner';       // Exact repository name case-sensitive

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
        keys.map((key) => {
          // Clear older versions of Luganda Learner caches specifically
          if (key.startsWith('luganda_learner_v') && key !== CACHE_NAME) {
            console.log(`[Service Worker] Cleared old Luganda cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: BOUNDED NETWORK FIRST with multi-app isolation
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Strict local boundary check: Origin matching AND explicit repository subfolder isolation
  if (requestUrl.includes(self.location.origin) && requestUrl.includes(REPO_NAME)) {
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
