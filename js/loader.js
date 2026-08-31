// ============================================================
// loader.js — Carga dinámica de scripts y Service Worker
// ============================================================

// --- CARGA DINÁMICA DE SCRIPTS (Lazy Loading) ---
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

let arScriptsLoaded = false;
let arLoadingPromise = null;

async function ensureARScriptsLoaded() {
  if (arScriptsLoaded) return;
  if (arLoadingPromise) return arLoadingPromise;

  arLoadingPromise = (async () => {
    console.log('[WebAR] Cargando A-Frame...');
    await loadScript('https://aframe.io/releases/1.3.0/aframe.min.js');

    // Registrar componente registerevents inmediatamente después de AFRAME
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['registerevents']) {
      AFRAME.registerComponent('registerevents', {
        init: function () {
          var marker = this.el;
          marker.addEventListener('markerFound', function () {
            window.dispatchEvent(new CustomEvent('ar-marker-found', { detail: { id: marker.id, preset: marker.getAttribute('preset') } }));
          });
          marker.addEventListener('markerLost', function () {
            window.dispatchEvent(new CustomEvent('ar-marker-lost', { detail: { id: marker.id, preset: marker.getAttribute('preset') } }));
          });
        }
      });
    }

    console.log('[WebAR] Cargando AR.js y complementos...');
    await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
    await loadScript('https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js');

    arScriptsLoaded = true;
    console.log('[WebAR] Motor WebAR listo.');
  })();

  return arLoadingPromise;
}

let modelViewerLoaded = false;
let modelViewerLoadingPromise = null;
async function ensureModelViewerLoaded() {
  if (modelViewerLoaded || (typeof customElements !== 'undefined' && customElements.get('model-viewer'))) {
    modelViewerLoaded = true;
    return;
  }
  if (modelViewerLoadingPromise) return modelViewerLoadingPromise;

  modelViewerLoadingPromise = loadScript('https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js')
    .then(() => {
      modelViewerLoaded = true;
      console.log('[WebAR] Visor 3D model-viewer listo.');
    })
    .catch((err) => {
      modelViewerLoadingPromise = null;
      console.warn('[WebAR] Error cargando script model-viewer:', err);
    });

  return modelViewerLoadingPromise;
}

// --- GESTIÓN DE SERVICE WORKER Y MODO OFFLINE ---
function initOfflineSupport() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.update().catch(() => {});
        console.log('[App] Service Worker registrado para offline:', reg.scope);
      }).catch(err => {
        console.warn('[App] Error al registrar Service Worker:', err);
      });
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadScript, ensureARScriptsLoaded, ensureModelViewerLoaded, initOfflineSupport };
}
