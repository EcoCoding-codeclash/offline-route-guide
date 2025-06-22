
const CACHE_NAME = 'ecomap-v2';
const OFFLINE_CACHE = 'ecomap-offline-v2';
const ROUTES_CACHE = 'ecomap-routes-v1';

// Cache essential files for offline functionality
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install service worker and cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE && cacheName !== ROUTES_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with different strategies for different types of requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle app shell (HTML, CSS, JS) - Cache First
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          });
        })
        .catch(() => {
          // Return offline page or cached version
          return caches.match('/');
        })
    );
    return;
  }

  // Handle map tiles - Network First with Cache Fallback
  if (url.hostname.includes('openstreetmap.org') || 
      url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(OFFLINE_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return from cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle API requests (routing, geocoding) - Network First with Cache Fallback
  if (url.hostname.includes('api.openrouteservice.org') || 
      url.hostname.includes('nominatim.openstreetmap.org')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(ROUTES_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
