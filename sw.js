/**
 * Real Alto WebAR - Service Worker para Experiencia 100% Offline
 */
const CACHE_NAME = 'realalto-offline-v21';

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
  // Metadatos y SEO
  './robots.txt',
  './sitemap.xml',
  './llms.txt',
  // Patrones AR y calibración de cámara local
  './assets/data/camera_para.dat',
  './assets/markers/patt.hiro',
  './assets/markers/patt.kanji',
  // Assets visuales
  './assets/img/choza.webp',
  './assets/img/background.webp',
  './assets/img/interiorchoza.webp',
  './assets/img/terreno.webp',
  './assets/img/entierrop.webp',
  './assets/img/logo.webp',
  './assets/img/logohome.webp',
  './assets/img/logoside.webp',
  './assets/img/logovaldivia.webp',
  './assets/entorno/mesa.png',
  './assets/models/valdivia.glb',
  './assets/models/valdivia.webp',
  './assets/models/bowl.glb',
  './assets/models/bowl2.glb',
  './assets/models/choza.glb',
  './assets/models/chozauno.webp',
  './assets/models/entierro.glb',
  './assets/models/vasija.webp',
  './assets/models/vasija1.webp',
  './assets/models/vasija2.webp',
  './assets/i18n/es.json',
  './assets/i18n/en.json',
  './assets/i18n/main.json',
  './assets/icon/favicon.ico',
  './assets/shapes.svg',
  // CDNs externos
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://aframe.io/releases/1.3.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
  'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js',
  // Decodificadores Draco y Basis para model-viewer en modo offline (CRÍTICO para GLB)
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js',
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm',
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js',
  'https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/basis_transcoder.js',
  'https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/basis_transcoder.wasm'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Precargando todos los recursos para modo offline (v9)...');
      for (const asset of PRECACHE_ASSETS) {
        try {
          const req = new Request(asset, {
            mode: asset.startsWith('http') ? 'cors' : 'same-origin',
            cache: 'reload'
          });
          const response = await fetch(req);
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(req, response.clone());
            // Si es relativo, también guardar con URL absoluta para garantizar coincidencias
            if (!asset.startsWith('http')) {
              const fullUrl = new URL(asset, self.location.href).href;
              await cache.put(fullUrl, response);
            }
          }
        } catch (err) {
          console.warn('[SW] No se pudo precargar recurso:', asset, err);
        }
      }
      console.log('[SW] Todos los recursos precargados con éxito.');
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

  // Para navegación HTML (documentos), intentar red primero para ver cambios al instante
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }
        return caches.match(event.request).then((c) => c || caches.match('./index.html'));
      }).catch(() => caches.match(event.request).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Para otros recursos: caché primero con fallback a red
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(async (cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Intentar coincidir por pathname si la URL difiere ligeramente
      try {
        const url = new URL(event.request.url);
        const pathMatch = await caches.match(url.pathname, { ignoreSearch: true });
        if (pathMatch) return pathMatch;
      } catch (e) {}

      // Intentar red
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || (!networkResponse.ok && networkResponse.type !== 'opaque')) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate' || event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        return new Response('Offline resource not found', {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
