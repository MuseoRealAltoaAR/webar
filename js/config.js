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
        name: 'Figurina FS-3312 (Valdivia V)',
        desc: 'Cabeza de figurina con deformación craneana occipital oblicua y tocado de arcilla en forma de máscara sobre la nariz. Superficie alisada y pulida con tonalidades amarillo-rojizas (Munsell 5YR 7/6–7/8), ojos y boca definidos por incisiones profundas.',
        dimensions: '36,7 × 44,55 × 24 mm',
        weight: '35,8 g',
        material: 'Arcilla pulida / Ahumado y quema',
        location: 'Montículo de la Cabeza (Unidad N238.240W155.1S8)'
      },
      vasija: {
        name: 'Vasija E-3 / Artefacto N.º 350 (Valdivia Fase IV)',
        desc: 'Vasija globular de cuello campaniforme y cuerpo esferoide. Presenta labio redondeado, borde evertido y cuello decorado con incisiones en zig-zag. Acabado pulido con engobe rojo en el labio y cuello interior.',
        dimensions: 'Boca: Ø 160 mm | Espesor: 8 mm',
        weight: 'N/A',
        material: 'Cerámica con engobe rojo / Incisiones en zig-zag',
        location: 'Estructura S-MH-1 (Rasgo F-295)'
      },
      vasija2: {
        name: 'Olla Artefacto N.º 181 (Valdivia Fase III-VII)',
        desc: 'Olla globular profunda de cuello corto y recto con labio de filo agudo y borde evertido. Clasificada como Valdivia inciso de línea ancha (tipo 16), con pulido exterior e interior, engobe rojo claro en el exterior y café claro en el interior.',
        dimensions: 'Mediana / Globular profunda',
        weight: 'N/A',
        material: 'Cerámica pulida / Engobe rojo y café / Inciso línea ancha',
        location: 'Estructura S-MH-2 (Rasgo F-263.4)'
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
        name: 'Reconstrucción Entierro de Mujer Principal (Tumba XXIV)',
        desc: 'Fardo funerario con cabeza falsa y máscara de cerámica Valdivia 3 de una mujer de alto rango (~35 años), en tumba pavimentada de manos de moler y metates. Acompañado por el entierro de un hombre joven (~20 años) con esqueleto segmentado, siete cuchillos de sílice (chert) y una mandíbula de venado.',
        dimensions: '',
        weight: '',
        material: '',
        location: 'Umbral de la Estructura 7, Montículo del Osario (Trinchera B, Tumba B-XXIV)'
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
        name: 'Figurine FS-3312 (Valdivia V)',
        desc: 'Figurine head with oblique occipital cranial deformation and a clay mask-shaped headdress extending over the nose. Smoothed and polished surface with reddish-yellow tones (Munsell 5YR 7/6–7/8), deeply incised eyes and mouth.',
        dimensions: '36.7 × 44.55 × 24 mm',
        weight: '35.8 g',
        material: 'Polished clay / Smoked & fired',
        location: 'Head Mound (Unit N238.240W155.1S8)'
      },
      vasija: {
        name: 'Vessel E-3 / Artifact No. 350 (Valdivia Phase IV)',
        desc: 'Globular vessel with bell-shaped neck and spheroid body. Features rounded lip, everted rim, and neck decorated with zig-zag incisions. Polished finish with red slip on the lip and inner neck.',
        dimensions: 'Mouth: Ø 160 mm | Thickness: 8 mm',
        weight: 'N/A',
        material: 'Red-slipped ceramic / Zig-zag incisions',
        location: 'Structure S-MH-1 (Feature F-295)'
      },
      vasija2: {
        name: 'Pot Artifact No. 181 (Valdivia Phase III-VII)',
        desc: 'Deep globular pot with short straight neck, sharp lip, and everted rim. Classified as Valdivia broad-line incised (Type 16), polished surfaces, light-red slip exterior and light-brown interior.',
        dimensions: 'Medium / Deep globular',
        weight: 'N/A',
        material: 'Polished ceramic / Red & brown slip / Broad-line incised',
        location: 'Structure S-MH-2 (Feature F-263.4)'
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
        name: 'Reconstruction of Principal Woman Burial (Tomb XXIV)',
        desc: 'Funerary bundle with false head and Valdivia 3 ceramic mask of a high-ranking woman (~35 years old), within a tomb paved with grinding stones and metates. Accompanied by the burial of a young man (~20 years old) with a segmented skeleton, seven chert knives, and a deer mandible.',
        dimensions: '',
        weight: '',
        material: '',
        location: 'Threshold of Structure 7, Charnel Mound (Trench B, Tomb B-XXIV)'
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
  // Librerías Vendor Locales (100% Offline)
  './assets/vendor/aframe.min.js',
  './assets/vendor/aframe-ar.js',
  './assets/vendor/aframe-extras.min.js',
  './assets/vendor/model-viewer.min.js',
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
