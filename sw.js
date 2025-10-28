// This version MUST match the 'appVersion' constant in index.html
const CACHE_NAME = 'my-pwa-shop-v2.7';

const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'manifest.json'
  // Note: We don't cache the sw.js file itself or external files like Font Awesome.
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

// Activate event: fires when the new service worker becomes active.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  // This function finds and removes old, outdated caches.
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

// Fetch event: fires for every network request from the app.
self.addEventListener('fetch', event => {
  // For now, we are just fetching from the network.
  // In a future step, you could add logic here to serve cached files
  // when the user is offline.
  event.respondWith(fetch(event.request));
});