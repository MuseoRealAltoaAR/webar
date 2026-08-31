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
      tableAlt: 'Mesa',
      viewChoza: 'Choza 3D'
    },
    modal: {
      dimensions: 'Dimensiones',
      weight: 'Peso',
      material: 'Material',
      location: 'Ubicación',
      viewInSpace: 'Ver en tu espacio (Google AR)'
    },
    experience: {
      choza_realalto: {
        name: 'Choza Real Alto',
        layerName: 'Entorno Choza'
      },
      entierro_realalto: {
        name: 'Excavación y Entierro',
        layerName: 'Entorno Excavación y Entierro'
      },
      choza2_realalto: {
        name: 'Choza Valdivia',
        layerName: 'Entorno Choza Valdivia'
      }
    },
    element: {
      valdivia: {
        name: 'Cabeza de Figurina Valdivia',
        desc: 'Pieza correspondiente a una cabeza de figurina con tocado en forma de máscara encontrada en el Montículo de la Cabeza. Presenta deformación craneana occipital y acabado alisado y pulido.',
        dimensions: '36,7 × 44,55 × 24 mm',
        weight: '35,8 g',
        material: 'Arcilla / Alisado y pulido',
        location: 'Montículo de la Cabeza'
      },
      vasija: {
        name: 'Vasija Cerámica Valdivia',
        desc: 'Recipiente ceremonial de cerámica tradicional de la cultura Valdivia con engobe rojizo y acabado alisado.',
        dimensions: '120 × 120 × 85 mm',
        weight: '185,4 g',
        material: 'Arcilla cocida / Engobe rojo',
        location: 'Montículo de las Ofrendas'
      },
      vasija2: {
        name: 'Cuenco Valdivia Decorado',
        desc: 'Cuenco cerámico pulido y decorado con incisiones geométricas de la cultura Valdivia.',
        dimensions: '145 × 145 × 92 mm',
        weight: '210,0 g',
        material: 'Cerámica incisa / Pulido fino',
        location: 'Plaza Central Real Alto'
      },
      choza2_realalto: {
        name: 'Choza Valdivia',
        desc: 'Representación 3D de la Choza Valdivia precolombina.',
        dimensions: '8,5 × 4,2 × 3,8 m',
        weight: 'N/A',
        material: 'Madera, caña y paja',
        location: 'Sector Residencial'
      },
      choza: {
        name: 'Choza Real Alto',
        desc: 'Estructura habitacional y ceremonial comunal de la cultura Valdivia en Real Alto, construida con postes de madera, caña guadua y techumbre vegetal.',
        dimensions: '8,5 × 4,2 × 3,8 m',
        weight: 'N/A',
        material: 'Madera, caña y paja',
        location: 'Sector Residencial'
      },
      entierro: {
        name: 'Entierro y Fardo Funerario Valdivia',
        desc: 'Contexto funerario prehispánico hallado en el yacimiento arqueológico de Real Alto, donde el individuo yace en posición flexionada dentro de un fardo ceremonial con ofrendas líticas y cerámicas.',
        dimensions: '1,2 × 0,8 × 0,6 m',
        weight: 'N/A',
        material: 'Fardo vegetal, osamenta y líticos',
        location: 'Área Funeraria Real Alto'
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
      tableAlt: 'Table',
      viewChoza: '3D Hut'
    },
    modal: {
      dimensions: 'Dimensions',
      weight: 'Weight',
      material: 'Material',
      location: 'Location',
      viewInSpace: 'View in your space (Google AR)'
    },
    experience: {
      choza_realalto: {
        name: 'Real Alto Hut',
        layerName: 'Hut Environment'
      },
      entierro_realalto: {
        name: 'Valdivia Burial',
        layerName: 'Excavation & Burial Environment'
      },
      choza2_realalto: {
        name: 'Valdivia Hut',
        layerName: 'Valdivia Hut Environment'
      }
    },
    element: {
      valdivia: {
        name: 'Valdivia Figurine Head',
        desc: 'Figurine head with a mask-shaped headdress found at the Head Mound. Features occipital cranial deformation and a smoothed, polished finish.',
        dimensions: '36.7 × 44.55 × 24 mm',
        weight: '35.8 g',
        material: 'Clay / Smoothed & polished',
        location: 'Head Mound'
      },
      vasija: {
        name: 'Valdivia Ceramic Vessel',
        desc: 'Traditional ceremonial ceramic vessel from the Valdivia culture with red slip and smoothed finish.',
        dimensions: '120 × 120 × 85 mm',
        weight: '185.4 g',
        material: 'Fired clay / Red slip',
        location: 'Offering Mound'
      },
      vasija2: {
        name: 'Decorated Valdivia Bowl',
        desc: 'Polished ceramic bowl decorated with geometric incisions from the Valdivia culture.',
        dimensions: '145 × 145 × 92 mm',
        weight: '210.0 g',
        material: 'Incised ceramic / Fine polish',
        location: 'Real Alto Central Plaza'
      },
      choza2_realalto: {
        name: 'Valdivia Hut',
        desc: '3D representation of the pre-Columbian Valdivia Hut.',
        dimensions: '8.5 × 4.2 × 3.8 m',
        weight: 'N/A',
        material: 'Wood, cane & thatch',
        location: 'Residential Sector'
      },
      choza: {
        name: 'Real Alto Hut',
        desc: 'Communal residential and ceremonial structure of the Valdivia culture at Real Alto, built with wooden posts, praise cane, and thatch roofing.',
        dimensions: '8.5 × 4.2 × 3.8 m',
        weight: 'N/A',
        material: 'Wood, cane & thatch',
        location: 'Residential Sector'
      },
      entierro: {
        name: 'Valdivia Burial & Funerary Bundle',
        desc: 'Pre-Hispanic funerary context discovered at the Real Alto archaeological site, featuring the flexed individual within a ceremonial bundle with lithic offerings.',
        dimensions: '1.2 × 0.8 × 0.6 m',
        weight: 'N/A',
        material: 'Vegetal bundle, skeletal remains & stone',
        location: 'Real Alto Funerary Area'
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
    markerType: 'pattern',
    markerUrl: 'assets/markers/patt.hiro',
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
          png: 'assets/models/valdivia.webp'
        },
        {
          id: 'vasija',
          nameKey: 'element.vasija.name',
          descKey: 'element.vasija.desc',
          glb: 'assets/models/bowl.glb',
          png: 'assets/models/vasija.webp'
        },
        {
          id: 'vasija2',
          nameKey: 'element.vasija2.name',
          descKey: 'element.vasija2.desc',
          glb: 'assets/models/bowl2.glb',
          png: 'assets/models/vasija2.webp'
        }
      ]
    }
  },
  {
    id: 'entierro_realalto',
    nameKey: 'experience.entierro_realalto.name',
    markerPreset: 'kanji',
    markerType: 'pattern',
    markerUrl: 'assets/markers/patt.kanji',
    markerLabel: 'Kanji',
    scanImage: 'assets/img/terreno.webp',
    directInterior: true,
    staticBackground: true,
    layer: {
      backgroundImage: 'assets/img/terreno.webp',
      foregroundImage: '',
      elements: [
        {
          id: 'entierro',
          nameKey: 'element.entierro.name',
          descKey: 'element.entierro.desc',
          glb: 'assets/models/entierro.glb',
          png: 'assets/img/entierrop.webp'
        }
      ]
    }
  }
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
  // Decodificadores Draco y Basis para model-viewer en modo offline
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js',
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm',
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js',
  'https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/basis_transcoder.js',
  'https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/basis_transcoder.wasm'
];


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n, experiences, state, OFFLINE_ASSETS_TO_PRELOAD };
}
