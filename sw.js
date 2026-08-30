/**
 * Real Alto WebAR - Service Worker para Experiencia 100% Offline
 */
const CACHE_NAME = 'realalto-offline-v5';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  // CSS por capas
  './css/base.css',
  './css/loading.css',
  './css/home.css',
  './css/ar.css',
  './css/interior.css',
  './css/sidebar.css',
  // JS por capas
  './js/config.js',
  './js/loader.js',
  './js/i18n.js',
  './js/ar.js',
  './js/interior.js',
  './js/ui.js',
  './js/main.js',
  // Otros recursos
  './robots.txt',
  './sitemap.xml',
  './llms.txt',
  './assets/img/choza.webp',
  './assets/img/background.webp',
  './assets/img/interiorchoza.webp',
  './assets/img/logo.webp',
  './assets/img/logohome.webp',
  './assets/img/logoside.webp',
  './assets/img/logovaldivia.webp',
  './assets/entorno/mesa.png',
  './assets/models/valdivia.glb',
  './assets/models/valdivia.png',
  './assets/i18n/es.json',
  './assets/i18n/en.json',
  './assets/i18n/main.json',
  './assets/icon/favicon.ico',
  './assets/shapes.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://aframe.io/releases/1.3.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
  'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Precargando recursos offline...');
      for (const asset of PRECACHE_ASSETS) {
        try {
          const response = await fetch(asset, { mode: asset.startsWith('http') ? 'cors' : 'same-origin' });
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(asset, response);
          }
        } catch (err) {
          console.warn('[SW] No se pudo precargar:', asset, err);
        }
      }
      console.log('[SW] Todos los recursos precargados.');
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || (!networkResponse.ok && networkResponse.type !== 'opaque')) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
