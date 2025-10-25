const CACHE_NAME = 'my-pwa-shop-v1.1'; // Give our cache a versioned name
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'manifest.json'
  // Note: We don't cache the sw.js file itself.
];

// Install event: fires when the service worker is first installed.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

// Activate event: fires when the service worker becomes active.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  // Remove old, outdated caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
        // Tell the active service worker to take control of the page immediately.
        return self.clients.claim();
    })
  );
});

// Fetch event: fires for every network request.
self.addEventListener('fetch', event => {
  // We'll add fetching logic here in the future for offline mode.
  // For now, it will just use the network.
  event.respondWith(fetch(event.request));
});