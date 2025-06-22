
const CACHE_NAME = 'ecomap-v3';
const OFFLINE_CACHE = 'ecomap-offline-v3';
const ROUTES_CACHE = 'ecomap-routes-v2';

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

  // Handle navigation requests (HTML pages) - Cache First with Network Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/')
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving cached HTML');
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            console.log('Fetching and caching HTML');
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/', responseClone);
            });
            return response;
          });
        })
        .catch(() => {
          console.log('Serving fallback HTML');
          return caches.match('/');
        })
    );
    return;
  }

  // Handle app assets (JS, CSS) - Cache First
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.includes('/assets/') ||
      url.pathname.includes('.js') ||
      url.pathname.includes('.css')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving cached asset:', url.pathname);
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            console.log('Fetching and caching asset:', url.pathname);
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
        .catch(() => {
          console.log('Asset not available offline:', url.pathname);
          return new Response('Not available offline', { status: 503 });
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

  // Default: Network First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.status === 200 && (
          request.destination === 'image' ||
          request.destination === 'font' ||
          request.destination === 'manifest'
        )) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Add message listener to handle dynamic caching
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  }
});
