
const CACHE_NAME = 'ecomap-v1';
const OFFLINE_CACHE = 'ecomap-offline-v1';

// Cache essential files
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // For map tiles, cache them as we fetch
        if (event.request.url.includes('openstreetmap.org') || 
            event.request.url.includes('tile.openstreetmap.org')) {
          return fetch(event.request).then((response) => {
            // Clone the response
            const responseClone = response.clone();
            
            caches.open(OFFLINE_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
            
            return response;
          }).catch(() => {
            // Return from offline cache if available
            return caches.match(event.request);
          });
        }
        
        return fetch(event.request);
      })
  );
});
