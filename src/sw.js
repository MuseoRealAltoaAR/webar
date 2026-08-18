/**
 * RealAlto WebAR - Service Worker
 * Version: 2.0.0
 * Provides offline capabilities, precaching of 3D models (.glb), images, and CDNs,
 * range request support for 3D loaders, and precache progress broadcasting.
 */

const CACHE_NAME = 'realalto-webar-v2';

const ASSETS_TO_CACHE = [
  // App Shell & Local Document Files
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',

  // 3D Models (.glb) - Heavy assets precached prior to entering
  './assets/models/valdivia.glb',
  './assets/models/duck.glb',

  // Model Previews & Icons (.png, .ico, .svg)
  './assets/models/valdivia.png',
  './assets/models/duck.png',
  './assets/entorno/mesa.png',
  './assets/icon/favicon.ico',
  './assets/shapes.svg',

  // UI & Experience Images (.webp, .png)
  './assets/img/logo.webp',
  './assets/img/logohome.webp',
  './assets/img/logoside.webp',
  './assets/img/logovaldivia.webp',
  './assets/img/background.webp',
  './assets/img/choza.webp',
  './assets/img/choza2.webp',
  './assets/img/interiorchoza.webp',
  './assets/img/interiorchoza.png',
  './assets/img/interiorchoza2.webp',

  // i18n Translations
  './assets/i18n/main.json',
  './assets/i18n/es.json',
  './assets/i18n/en.json',

  // External CDN scripts and styles
  'https://aframe.io/releases/1.3.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
  'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js',
  'https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css',
  'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js',
  'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap'
];

// Helper: Broadcast message to all active clients
async function broadcastMessage(message) {
  const allClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of allClients) {
    client.postMessage(message);
  }
}

// Install Event: Resilient Pre-caching with Progress Broadcasting
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event started.');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const total = ASSETS_TO_CACHE.length;
      let loaded = 0;

      console.log(`[Service Worker] Precaching ${total} assets...`);

      // Pre-cache assets with individual error boundaries
      const cachePromises = ASSETS_TO_CACHE.map(async (url) => {
        try {
          const isCrossOrigin = url.startsWith('http') && !url.includes(self.location.origin);
          const request = new Request(url, {
            mode: isCrossOrigin ? 'cors' : 'same-origin',
            credentials: 'same-origin'
          });

          let response = await fetch(request);
          if (!response.ok && response.type !== 'opaque') {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          await cache.put(url, response);
        } catch (err) {
          // If CORS fetch fails on CDN, try opaque request fallback
          if (url.startsWith('http')) {
            try {
              const fallbackResponse = await fetch(url, { mode: 'no-cors' });
              if (fallbackResponse) {
                await cache.put(url, fallbackResponse);
              }
            } catch (fallbackErr) {
              console.warn(`[Service Worker] Failed to cache asset: ${url}`, fallbackErr);
            }
          } else {
            console.warn(`[Service Worker] Failed to cache local asset: ${url}`, err);
          }
        } finally {
          loaded++;
          await broadcastMessage({
            type: 'PRECACHE_PROGRESS',
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100),
            currentUrl: url
          });
        }
      });

      await Promise.all(cachePromises);
      console.log('[Service Worker] All assets precached successfully.');

      await broadcastMessage({
        type: 'PRECACHE_COMPLETE',
        loaded: total,
        total
      });

      return self.skipWaiting();
    })()
  );
});

// Activate Event: Clean up outdated caches & claim clients immediately
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new Service Worker...');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', name);
            return caches.delete(name);
          }
        })
      );
      await self.clients.claim();
      console.log('[Service Worker] Clients claimed.');
    })()
  );
});

// Helper: Handle HTTP Range requests for cached 3D models or media
async function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) return cachedResponse;

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const totalBytes = arrayBuffer.byteLength;

  const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
  if (!match) return cachedResponse;

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : totalBytes - 1;

  if (start >= totalBytes || end >= totalBytes || start > end) {
    return new Response('', {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: {
        'Content-Range': `bytes */${totalBytes}`
      }
    });
  }

  const slicedBuffer = arrayBuffer.slice(start, end + 1);
  const headers = new Headers(cachedResponse.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${totalBytes}`);
  headers.set('Content-Length', slicedBuffer.byteLength.toString());
  headers.set('Accept-Ranges', 'bytes');

  return new Response(slicedBuffer, {
    status: 206,
    statusText: 'Partial Content',
    headers
  });
}

// Fetch Event: Cache-First strategy with Range Support & Network Fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle HTTP & HTTPS requests
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    (async () => {
      // 1. Check Cache
      const cachedResponse = await caches.match(request, { ignoreSearch: false });
      if (cachedResponse) {
        if (request.headers.has('range')) {
          return handleRangeRequest(request, cachedResponse);
        }
        return cachedResponse;
      }

      // 2. Try Cache match without search params if query strings exist
      const cachedWithoutSearch = await caches.match(request, { ignoreSearch: true });
      if (cachedWithoutSearch) {
        if (request.headers.has('range')) {
          return handleRangeRequest(request, cachedWithoutSearch);
        }
        return cachedWithoutSearch;
      }

      // 3. Network Fetch and store in cache for subsequent visits
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      } catch (fetchErr) {
        // Fallback or offline indication
        console.warn('[Service Worker] Network request failed:', request.url, fetchErr);
        const fallbackResponse = await caches.match(request, { ignoreSearch: true });
        if (fallbackResponse) return fallbackResponse;

        // If navigation request fails offline, fallback to root index.html
        if (request.mode === 'navigate') {
          const rootFallback = await caches.match('./index.html') || await caches.match('./');
          if (rootFallback) return rootFallback;
        }

        return new Response('Network error and not in cache', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Message Event: Handle control messages from the app
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Automatic Dynamic Caching for new models and assets sent from app configuration
  if (event.data.type === 'CACHE_DYNAMIC_ASSETS' && Array.isArray(event.data.assets)) {
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const assetUrl of event.data.assets) {
        try {
          const match = await cache.match(assetUrl);
          if (!match) {
            const res = await fetch(assetUrl);
            if (res && (res.status === 200 || res.type === 'opaque')) {
              await cache.put(assetUrl, res);
              console.log('[Service Worker] Auto-cached dynamic asset:', assetUrl);
            }
          }
        } catch (e) {
          console.warn('[Service Worker] Could not auto-cache dynamic asset:', assetUrl, e);
        }
      }
    });
  }

  if (event.data.type === 'CHECK_CACHE_STATUS') {
    caches.open(CACHE_NAME).then(async (cache) => {
      let cachedCount = 0;
      for (const asset of ASSETS_TO_CACHE) {
        const match = await cache.match(asset);
        if (match) cachedCount++;
      }
      const total = ASSETS_TO_CACHE.length;
      event.source.postMessage({
        type: 'CACHE_STATUS_RESULT',
        cached: cachedCount,
        total,
        percentage: Math.round((cachedCount / total) * 100),
        isComplete: cachedCount === total
      });
    });
  }
});
