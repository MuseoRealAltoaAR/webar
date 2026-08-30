// ============================================================
// config.js — Datos estáticos: i18n, experiences, state
// ============================================================

// --- DICCIONARIO DE INTERNACIONALIZACIÓN (i18n) ---
const i18n = {
  es: {
    app: {
      enterCabin: 'Entrar a la choza',
      arSceneAlt: 'Escena AR'
    },
    common: {
      menu: 'Menú',
      logo: 'Logo',
      complex: 'COMPLEJO CULTURAL',
      close: 'Cerrar',
      detail: 'Detalle'
    },
    home: {
      location: 'Santa Elena · Ecuador',
      pitch: 'Guía Interactiva en Realidad Aumentada',
      description: 'Descubre réplicas arqueológicas tridimensionales e historia interactiva directamente en el área abierta del museo.',
      startAr: 'Iniciar recorrido WebAR',
      cameraWarning: 'Requiere permisos de cámara y un entorno bien iluminado'
    },
    sidebar: {
      home: 'INICIO',
      information: 'INFORMACIÓN',
      ar: 'WEB AR EXP.',
      exit: 'Salir',
      language: 'Idioma'
    },
    information: {
      title: 'Información',
      hoursTitle: 'Horarios de Atención',
      weekday: 'Lunes - Viernes: 9:00am - 5:00pm',
      saturday: 'Sábados: 10:00am - 4:00pm',
      sunday: 'Domingos: Cerrado',
      locationTitle: 'Ubicación',
      locationLine1: 'Complejo Cultural Real Alto',
      locationLine2: 'Península de Santa Elena',
      locationLine3: 'Ecuador',
      moreTitle: 'Más Información'
    },
    ar: {
      backMenu: 'Volver al menú',
      reset: 'Reiniciar',
      orientationWarning: 'Para escanear marcadores, gira el teléfono a horizontal.',
      markerMenu: 'Marcadores (toca para desplegar)',
      status: {
        loading: 'Solicitando cámara...',
        scanning: 'Escaneando marcador [{marker}]',
        detected: 'Marcador detectado',
        searching: 'Buscando marcador...',
        paused: 'Escaneo pausado',
        resetting: 'Reiniciando escaneo...',
        cameraError: 'Permiso de cámara requerido',
        loadingEngine: 'Cargando motor WebAR...'
      }
    },
    cabin: {
      backToScan: 'Volver a escanear',
      tableAlt: 'Mesa'
    },
    experience: {
      choza_realalto: {
        name: 'Choza Real Alto',
        layerName: 'Entorno Choza'
      },
      choza2_realalto: {
        name: 'Choza Valdivia',
        layerName: 'Entorno Choza Valdivia'
      }
    },
    element: {
      valdivia: {
        name: 'Estatuilla Valdivia',
        desc: 'Figura cerámica de la cultura Valdivia, representando la fertilidad y el arte precolombino.'
      },
      choza2_realalto: {
        name: 'Choza Valdivia',
        desc: 'Representación 3D de la Choza Valdivia precolombina.'
      }
    }
  },
  en: {
    app: {
      enterCabin: 'Enter the cabin',
      arSceneAlt: 'AR scene'
    },
    common: {
      menu: 'Menu',
      logo: 'Logo',
      complex: 'CULTURAL COMPLEX',
      close: 'Close',
      detail: 'Detail'
    },
    home: {
      location: 'Santa Elena · Ecuador',
      pitch: 'Interactive Augmented Reality Guide',
      description: "Discover 3D archaeological replicas and interactive history directly in the museum's open area.",
      startAr: 'Start WebAR tour',
      cameraWarning: 'Camera permission and good lighting are required'
    },
    sidebar: {
      home: 'HOME',
      information: 'INFORMATION',
      ar: 'WEB AR EXP.',
      exit: 'Exit',
      language: 'Language'
    },
    information: {
      title: 'Information',
      hoursTitle: 'Opening Hours',
      weekday: 'Monday - Friday: 9:00am - 5:00pm',
      saturday: 'Saturday: 10:00am - 4:00pm',
      sunday: 'Sunday: Closed',
      locationTitle: 'Location',
      locationLine1: 'Real Alto Cultural Complex',
      locationLine2: 'Santa Elena Peninsula',
      locationLine3: 'Ecuador',
      moreTitle: 'More Information'
    },
    ar: {
      backMenu: 'Back to menu',
      reset: 'Reset',
      orientationWarning: 'To scan markers, rotate your phone to landscape.',
      markerMenu: 'Markers (tap to open)',
      status: {
        loading: 'Requesting camera...',
        scanning: 'Scanning marker [{marker}]',
        detected: 'Marker detected',
        searching: 'Searching for marker...',
        paused: 'Scanning paused',
        resetting: 'Resetting scan...',
        cameraError: 'Camera permission required',
        loadingEngine: 'Loading WebAR engine...'
      }
    },
    cabin: {
      backToScan: 'Back to scan',
      tableAlt: 'Table'
    },
    experience: {
      choza_realalto: {
        name: 'Real Alto Hut',
        layerName: 'Hut Environment'
      },
      choza2_realalto: {
        name: 'Valdivia Hut',
        layerName: 'Valdivia Hut Environment'
      }
    },
    element: {
      valdivia: {
        name: 'Valdivia Figurine',
        desc: 'Ceramic figurine from the Valdivia culture, representing fertility and pre-Columbian art.'
      },
      choza2_realalto: {
        name: 'Valdivia Hut',
        desc: '3D representation of the pre-Columbian Valdivia Hut.'
      }
    }
  }
};

// =============================================================
// PATRÓN DE DISEÑO: Cómo agregar un marcador nuevo
// =============================================================
// Cada experiencia sigue el mismo esquema. Para agregar una nueva:
//
//  1. Copiar la PLANTILLA de abajo y pegarla en el array experiences[].
//  2. Agregar las claves i18n en ambos idiomas (es / en) más arriba.
//  3. Subir los assets a sus carpetas correspondientes.
//
//  ASSETS REQUERIDOS POR MARCADOR
//  ───────────────────────────────────────────────────────────────────
//  assets/img/       chozaN.webp           ← imagen al detectar marcador
//  assets/img/       interiorchozaN.webp   ← fondo panorámico 360
//  assets/models/    piezaN.glb            ← modelo 3D (Google model-viewer)
//  assets/models/    piezaN.png            ← thumbnail de la pieza
//
//  MARCADORES AR.JS DISPONIBLES (sin necesidad de archivo extra)
//  ───────────────────────────────────────────────────────────────────
//  'hiro'   → patrón cuadrado estándar (ya en uso)
//  'kanji'  → patrón kanji estándar    (ya en uso)
//  Para marcadores personalizados: markerType: 'pattern' + markerUrl: 'assets/markers/mi.patt'
//
//  CLAVES i18n REQUERIDAS (añadir en es y en)
//  ───────────────────────────────────────────────────────────────────
//  experience.ID.name       → nombre en el menú de marcadores
//  element.ELEM_ID.name     → nombre de la pieza en el modal 3D
//  element.ELEM_ID.desc     → descripción de la pieza en el modal 3D
//
//  NOTA: el <a-marker> en la escena A-Frame se genera automáticamente
//  a partir de este array — no es necesario editar ar.js ni index.html.
// =============================================================

// --- PLANTILLA — copiar y completar para agregar un marcador ---
//
// {
//   id: 'ID_UNICO',                                   // snake_case, sin espacios
//   nameKey: 'experience.ID_UNICO.name',              // clave i18n
//   markerPreset: 'hiro',                             // preset AR.js
//   markerLabel: 'Etiqueta visible',                  // texto en el menú
//   scanImage: 'assets/img/chozaN.webp',              // imagen al detectar
//   layer: {
//     backgroundImage: 'assets/img/interiorchozaN.webp',  // fondo 360
//     foregroundImage: 'assets/entorno/mesa.png',         // mesa (reutilizable)
//     elements: [
//       {
//         id: 'ID_PIEZA',                             // snake_case único
//         nameKey: 'element.ID_PIEZA.name',           // clave i18n nombre
//         descKey: 'element.ID_PIEZA.desc',           // clave i18n descripción
//         glb: 'assets/models/piezaN.glb',            // modelo 3D
//         png: 'assets/models/piezaN.png'             // thumbnail
//       }
//       // Se pueden agregar más piezas al array elements[]
//     ]
//   }
// },

// --- DATA DE EXPERIENCIAS ---
const experiences = [
  {
    id: 'choza_realalto',
    nameKey: 'experience.choza_realalto.name',
    markerPreset: 'hiro',
    markerLabel: 'Hiro',
    scanImage: 'assets/img/choza.webp',
    layer: {
      backgroundImage: 'assets/img/interiorchoza.webp',
      foregroundImage: 'assets/entorno/mesa.png',
      elements: [
        {
          id: 'valdivia',
          nameKey: 'element.valdivia.name',
          descKey: 'element.valdivia.desc',
          glb: 'assets/models/valdivia.glb',
          png: 'assets/models/valdivia.png'
        }
      ]
    }
  },
];

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
const state = {
  lang: (typeof localStorage !== 'undefined' && localStorage.getItem('app.language')) || 'es',
  currentTab: 'inicio',
  arStarted: false,
  activeExperienceId: 'choza_realalto',
  isLandscape: true,
  isMarkerMenuOpen: false,
  markerVisible: false,
  interiorActive: false,
  statusMode: 'loading',
  panoramaOffsetX: 0,
  lastYawDeg: null,
  isDragging: false,
  startTouchX: 0,
  dragStartOffsetX: 0
};

// --- LISTA DE RECURSOS PARA CACHÉ OFFLINE ---
const OFFLINE_ASSETS_TO_PRELOAD = [
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
  // Assets visuales
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
  // CDNs externos
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://aframe.io/releases/1.3.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
  'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
  'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
];


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n, experiences, state, OFFLINE_ASSETS_TO_PRELOAD };
}
