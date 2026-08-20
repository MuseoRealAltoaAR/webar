// --- CARGA DINÁMICA DE SCRIPTS (Lazy Loading para máximo rendimiento) ---
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
async function ensureModelViewerLoaded() {
  if (modelViewerLoaded || customElements.get('model-viewer')) return;
  await loadScript('https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js');
  modelViewerLoaded = true;
}

// --- LISTA COMPLETA DE RECURSOS PARA DESCARGA Y CACHÉ OFFLINE ---
const OFFLINE_ASSETS_TO_PRELOAD = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './robots.txt',
  './sitemap.xml',
  './llms.txt',
  './assets/img/choza.webp',
  './assets/img/choza2.webp',
  './assets/img/background.webp',
  './assets/img/interiorchoza.webp',
  './assets/img/interiorchoza2.webp',
  './assets/img/logo.webp',
  './assets/img/logohome.webp',
  './assets/img/logoside.webp',
  './assets/img/logovaldivia.webp',
  './assets/entorno/mesa.png',
  './assets/models/valdivia.glb',
  './assets/models/valdivia.png',
  './assets/models/duck.glb',
  './assets/models/duck.png',
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
  {
    id: 'choza2_realalto',
    nameKey: 'experience.choza2_realalto.name',
    markerPreset: 'kanji',
    markerLabel: 'Kanji',
    scanImage: 'assets/img/choza2.webp',
    layer: {
      backgroundImage: 'assets/img/interiorchoza2.webp',
      foregroundImage: 'assets/entorno/mesa.png',
      elements: [
        {
          id: 'choza2_realalto',
          nameKey: 'element.choza2_realalto.name',
          descKey: 'element.choza2_realalto.desc',
          glb: 'assets/models/duck.glb',
          png: 'assets/models/duck.png'
        }
      ]
    }
  }
];

// --- ESTADO DE LA APLICACIÓN ---
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

// --- FUNCIONES DE INTERNACIONALIZACIÓN ---
function t(key) {
  if (!key) return '';
  const parts = key.split('.');
  let current = i18n[state.lang] || i18n.es;
  for (const part of parts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      return key;
    }
  }
  return typeof current === 'string' ? current : key;
}

function setLanguage(lang) {
  if (!i18n[lang]) return;
  state.lang = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('app.language', lang);
  }

  // Actualizar botones de idioma si estamos en entorno con DOM
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset?.lang === lang);
    });

    // Traducir todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    renderMarkerMenu();
    updateStatusText();
  }
}

// --- NAVEGACIÓN Y PANTALLAS ---
function showScreen(tabName) {
  state.currentTab = tabName;
  
  // Ocultar vistas principales
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('info-screen').classList.add('hidden');
  document.getElementById('ui-ar').classList.add('hidden');
  document.getElementById('interior-overlay').classList.add('hidden');
  document.getElementById('fixed-choza-overlay').classList.add('hidden');

  // Actualizar clase activa en menú lateral
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });

  if (tabName === 'inicio') {
    document.getElementById('home-screen').classList.remove('hidden');
    state.arStarted = false;
  } else if (tabName === 'informacion') {
    document.getElementById('info-screen').classList.remove('hidden');
    state.arStarted = false;
  } else if (tabName === 'ar') {
    document.getElementById('ui-ar').classList.remove('hidden');
    startARTracking();
  }
}

// --- CONTROL DE WEBAR ---
function getActiveExperience() {
  return experiences.find(exp => exp.id === state.activeExperienceId) || experiences[0];
}

let cameraStreamActive = false;
let arSceneInitialized = false;

async function requestCameraAccess() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('[WebAR] getUserMedia no está disponible directamente en este contexto');
      return true;
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    // Liberamos el stream temporal para que el motor AR.js tome control exclusivo del dispositivo
    stream.getTracks().forEach(t => t.stop());
    cameraStreamActive = true;
    return true;
  } catch (err) {
    console.error('[WebAR] Permiso de cámara no concedido o error:', err);
    return false;
  }
}

async function startARTracking() {
  state.arStarted = true;
  state.statusMode = 'loading';
  updateStatusText();
  
  const statusDot = document.getElementById('status-dot');
  if (statusDot) statusDot.classList.add('active');

  checkOrientation();

  // 1. Solicitar permisos de cámara de manera explícita al usuario
  const cameraGranted = await requestCameraAccess();
  if (!cameraGranted) {
    state.statusMode = 'cameraError';
    updateStatusText();
    alert(state.lang === 'es'
      ? 'Se requiere acceso a la cámara para escanear marcadores WebAR. Por favor permite los permisos de cámara en tu navegador.'
      : 'Camera permission is required to scan WebAR markers. Please grant permissions in your browser.');
    return;
  }

  // 2. Asegurar que las librerías AR (A-Frame y AR.js) estén cargadas
  state.statusMode = 'loadingEngine';
  updateStatusText();
  try {
    await ensureARScriptsLoaded();
  } catch (err) {
    console.error('[WebAR] Error cargando scripts de AR:', err);
    state.statusMode = 'loading';
    updateStatusText();
    return;
  }

  // 3. Inyectar escena A-Frame si aún no ha sido creada
  const container = document.getElementById('ar-scene-container');
  if (container && !arSceneInitialized) {
    container.innerHTML = `
      <a-scene 
        id="aframe-scene"
        embedded 
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; colorManagement: true;">
        
        <!-- Marcador HIRO (Choza Real Alto) -->
        <a-marker id="marker-hiro" preset="hiro" registerevents>
        </a-marker>

        <!-- Marcador KANJI (Choza Valdivia) -->
        <a-marker id="marker-kanji" preset="kanji" registerevents>
        </a-marker>

        <a-entity camera>
          <a-cursor raycaster="objects: a-image, a-entity" cursor="fuse: false" visible="false"></a-cursor>
        </a-entity>
      </a-scene>
    `;
    arSceneInitialized = true;
  }

  state.statusMode = 'scanning';
  updateStatusText();
  requestDeviceOrientation();

  // Forzar resize para que AR.js calibre el feed de la cámara
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 350);
}

function resetExperience() {
  state.markerVisible = false;
  state.statusMode = 'resetting';
  updateStatusText();

  const fixedOverlay = document.getElementById('fixed-choza-overlay');
  if (fixedOverlay) fixedOverlay.classList.add('hidden');

  setTimeout(() => {
    state.statusMode = 'scanning';
    updateStatusText();
  }, 300);
}

function renderMarkerMenu() {
  const container = document.getElementById('marker-dropdown-content');
  if (!container) return;
  container.innerHTML = '';

  experiences.forEach(exp => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `marker-pill interactive ${exp.id === state.activeExperienceId ? 'active' : ''}`;
    btn.textContent = `${exp.markerLabel || exp.markerPreset.toUpperCase()} - ${t(exp.nameKey)}`;
    btn.addEventListener('click', () => {
      selectExperience(exp.id);
    });
    container.appendChild(btn);
  });
}

function selectExperience(expId) {
  state.activeExperienceId = expId;
  state.isMarkerMenuOpen = false;
  
  const content = document.getElementById('marker-dropdown-content');
  const arrow = document.getElementById('marker-arrow');
  if (content) content.classList.add('hidden');
  if (arrow) arrow.classList.remove('open');

  renderMarkerMenu();
  resetExperience();
}

function updateStatusText() {
  const statusTextEl = document.getElementById('status-text');
  if (!statusTextEl) return;

  if (state.statusMode === 'scanning') {
    const exp = getActiveExperience();
    const template = t('ar.status.scanning');
    statusTextEl.textContent = template.replace('{marker}', (exp.markerPreset || '').toUpperCase());
  } else {
    statusTextEl.textContent = t(`ar.status.${state.statusMode}`);
  }
}

// --- DETECCIÓN DE MARCADORES (Custom Events desde A-Frame) ---
function handleMarkerFound(event) {
  if (!state.isLandscape || !state.arStarted || state.interiorActive) return;

  const detail = event.detail || {};
  const activeExp = getActiveExperience();
  const detectedPreset = (detail.preset || '').toLowerCase();
  const detectedId = (detail.id || '').toLowerCase();

  const isMatching = detectedPreset === activeExp.markerPreset.toLowerCase() ||
                     detectedId === `marker-${activeExp.markerPreset.toLowerCase()}`;

  if (isMatching) {
    state.markerVisible = true;
    state.statusMode = 'detected';
    updateStatusText();

    // Mostrar overlay de Choza fija a pantalla completa sin blur
    setTimeout(() => {
      if (state.markerVisible && state.arStarted && !state.interiorActive) {
        showFixedChozaOverlay(activeExp);
      }
    }, 400);
  }
}

function handleMarkerLost(event) {
  const detail = event.detail || {};
  const activeExp = getActiveExperience();
  const detectedPreset = (detail.preset || '').toLowerCase();
  const detectedId = (detail.id || '').toLowerCase();

  const isMatching = detectedPreset === activeExp.markerPreset.toLowerCase() ||
                     detectedId === `marker-${activeExp.markerPreset.toLowerCase()}`;

  if (isMatching) {
    state.markerVisible = false;
    if (state.arStarted && !state.interiorActive) {
      state.statusMode = 'searching';
      updateStatusText();
    }
  }
}

function showFixedChozaOverlay(exp) {
  const overlay = document.getElementById('fixed-choza-overlay');
  const img = document.getElementById('fixed-choza-img');
  if (overlay && img) {
    img.src = exp.scanImage;
    overlay.classList.remove('hidden');
  }
}

// --- VISTA INTERIOR DE LA CHOZA (Cabin View 360) ---
function enterInteriorCabin() {
  state.interiorActive = true;
  state.panoramaOffsetX = 0;
  state.lastYawDeg = null;

  // Ocultar AR overlay
  document.getElementById('fixed-choza-overlay').classList.add('hidden');
  document.getElementById('ui-ar').classList.add('hidden');

  // Configurar y mostrar interior
  const interiorOverlay = document.getElementById('interior-overlay');
  const interiorBg = document.getElementById('interior-bg');
  const mesaImg = document.getElementById('mesa-img');
  const activeExp = getActiveExperience();

  if (interiorBg) {
    interiorBg.style.backgroundImage = `url('${activeExp.layer.backgroundImage}')`;
    interiorBg.style.backgroundPosition = '0px 50%';
    interiorBg.classList.remove('blurred');
  }

  if (mesaImg) {
    mesaImg.src = activeExp.layer.foregroundImage;
  }

  renderInteriorElements(activeExp.layer.elements);
  interiorOverlay.classList.remove('hidden');
}

function exitInteriorCabin() {
  state.interiorActive = false;
  document.getElementById('interior-overlay').classList.add('hidden');
  showScreen('ar');
}

function renderInteriorElements(elements) {
  const container = document.getElementById('elements-horizontal-container');
  if (!container) return;
  container.innerHTML = '';

  elements.forEach(elem => {
    const imgBtn = document.createElement('img');
    imgBtn.src = elem.png;
    imgBtn.alt = t(elem.nameKey);
    imgBtn.className = 'valdivia-btn interactive';
    imgBtn.width = 75;
    imgBtn.height = 75;
    imgBtn.loading = 'lazy';
    imgBtn.addEventListener('click', () => {
      openModelDialog(elem);
    });
    container.appendChild(imgBtn);
  });
}

// --- DIÁLOGO MODAL 3D (Google model-viewer) ---
async function openModelDialog(elem) {
  // Asegurar que el componente <model-viewer> esté cargado antes de abrir el modal
  await ensureModelViewerLoaded();

  const modal = document.getElementById('model-dialog');
  const viewer = document.getElementById('main-model-viewer');
  const titleEl = document.getElementById('modal-piece-title');
  const descEl = document.getElementById('modal-piece-desc');
  const interiorBg = document.getElementById('interior-bg');

  if (titleEl) titleEl.textContent = t(elem.nameKey);
  if (descEl) descEl.textContent = t(elem.descKey);
  if (interiorBg) interiorBg.classList.add('blurred');

  // 1. Mostrar modal
  if (modal) {
    modal.classList.remove('hidden');
  }

  // 2. Asignar ruta al model-viewer
  if (viewer) {
    const absoluteGlbUrl = new URL(elem.glb, window.location.href).href;
    console.log('[3D Viewer] Cargando modelo GLB desde:', absoluteGlbUrl);
    viewer.setAttribute('src', absoluteGlbUrl);
  }
}

function closeModelDialog() {
  const modal = document.getElementById('model-dialog');
  const viewer = document.getElementById('main-model-viewer');
  const interiorBg = document.getElementById('interior-bg');

  if (modal) modal.classList.add('hidden');
  if (viewer) viewer.removeAttribute('src');
  if (interiorBg) interiorBg.classList.remove('blurred');
}

// --- GIROSCOPIO Y TOUCH CONTROLS PARA INTERIOR 360 ---
function handleDeviceOrientation(event) {
  if (!state.interiorActive || state.isDragging) return;

  const anyEvent = event;
  let yaw = null;

  if (typeof anyEvent.webkitCompassHeading === 'number') {
    yaw = anyEvent.webkitCompassHeading;
  } else if (typeof event.alpha === 'number') {
    yaw = event.alpha;
  }

  if (yaw === null) return;

  if (state.lastYawDeg === null) {
    state.lastYawDeg = yaw;
    return;
  }

  let deltaYaw = yaw - state.lastYawDeg;
  if (deltaYaw > 180) deltaYaw -= 360;
  else if (deltaYaw < -180) deltaYaw += 360;

  state.lastYawDeg = yaw;
  state.panoramaOffsetX += deltaYaw * 6;

  const interiorBg = document.getElementById('interior-bg');
  if (interiorBg) {
    interiorBg.style.backgroundPosition = `${state.panoramaOffsetX}px 50%`;
  }
}

function setupTouchPanControls() {
  const overlay = document.getElementById('interior-overlay');
  if (!overlay) return;

  overlay.addEventListener('touchstart', (e) => {
    if (!state.interiorActive) return;
    state.isDragging = true;
    state.startTouchX = e.touches[0].clientX;
    state.dragStartOffsetX = state.panoramaOffsetX;
  }, { passive: true });

  overlay.addEventListener('touchmove', (e) => {
    if (!state.isDragging || !state.interiorActive) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - state.startTouchX;
    const currentOffset = state.dragStartOffsetX + deltaX * 1.2;

    const interiorBg = document.getElementById('interior-bg');
    if (interiorBg) {
      interiorBg.style.backgroundPosition = `${currentOffset}px 50%`;
    }
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    if (!state.isDragging) return;
    state.isDragging = false;
    const touch = e.changedTouches?.[0];
    if (touch) {
      const deltaX = touch.clientX - state.startTouchX;
      state.panoramaOffsetX = state.dragStartOffsetX + deltaX * 1.2;
    }
  }, { passive: true });
}

async function requestDeviceOrientation() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === 'granted') {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    } catch (err) {
      console.warn('Orientation permission not granted:', err);
    }
  } else {
    window.addEventListener('deviceorientation', handleDeviceOrientation);
  }
}

// --- DETECCIÓN DE ORIENTACIÓN LANDSCAPE/PORTRAIT ---
function checkOrientation() {
  state.isLandscape = window.innerWidth > window.innerHeight;
  const warningEl = document.getElementById('orientation-warning');
  const dropdownEl = document.getElementById('marker-dropdown-wrapper');
  
  if (warningEl) {
    warningEl.classList.toggle('hidden', state.isLandscape);
  }
  if (dropdownEl) {
    dropdownEl.classList.toggle('hidden', !state.isLandscape);
  }

  if (!state.isLandscape && state.arStarted) {
    state.statusMode = 'paused';
    updateStatusText();
  } else if (state.isLandscape && state.arStarted) {
    state.statusMode = 'scanning';
    updateStatusText();
  }
}

// --- GESTIÓN DE SERVICE WORKER Y MODO OFFLINE ---
function initOfflineSupport() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('[App] Service Worker registrado para offline:', reg.scope);
      }).catch(err => {
        console.warn('[App] Error al registrar Service Worker:', err);
      });
    });
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const fillEl = document.getElementById('preload-progress-fill');
  const percentEl = document.getElementById('preload-percent');
  const statusEl = document.getElementById('preload-status');

  if (fillEl) fillEl.style.width = '100%';
  if (percentEl) percentEl.textContent = '100%';
  if (statusEl) statusEl.innerHTML = '<span>¡Listo!</span>';

  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }, 150);
  }
}

// --- INICIALIZACIÓN DE LA APLICACIÓN ---
function initializeApp() {
  // 1. Ocultar splash y activar Service Worker en segundo plano
  hideLoadingScreen();
  initOfflineSupport();

  // 2. Configurar botones de cambio de idioma
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // 3. Configurar Sidebar Drawer
  const sidebarWrapper = document.getElementById('sidebar-wrapper');
  const homeMenuBtn = document.getElementById('home-menu-btn');
  const infoMenuBtn = document.getElementById('info-menu-btn');
  const exitBtn = document.getElementById('btn-sidebar-exit');

  const openSidebar = () => sidebarWrapper.classList.add('open');
  const closeSidebar = () => sidebarWrapper.classList.remove('open');

  if (homeMenuBtn) homeMenuBtn.addEventListener('click', openSidebar);
  if (infoMenuBtn) infoMenuBtn.addEventListener('click', openSidebar);
  if (sidebarWrapper) {
    sidebarWrapper.addEventListener('click', (e) => {
      if (e.target === sidebarWrapper) closeSidebar();
    });
  }
  if (exitBtn) exitBtn.addEventListener('click', closeSidebar);

  // Tabs del Sidebar
  document.getElementById('nav-inicio')?.addEventListener('click', () => {
    closeSidebar();
    showScreen('inicio');
  });
  document.getElementById('nav-informacion')?.addEventListener('click', () => {
    closeSidebar();
    showScreen('informacion');
  });
  document.getElementById('nav-ar')?.addEventListener('click', () => {
    closeSidebar();
    showScreen('ar');
  });

  // 4. Botón Iniciar WebAR en el Home
  document.getElementById('start-ar-btn')?.addEventListener('click', () => {
    showScreen('ar');
  });

  // 5. Botones de la barra superior AR
  document.getElementById('ar-back-home-btn')?.addEventListener('click', () => {
    showScreen('inicio');
  });
  document.getElementById('ar-reset-btn')?.addEventListener('click', () => {
    resetExperience();
  });

  // 6. Desplegable de marcadores
  const markerToggle = document.getElementById('marker-dropdown-toggle');
  const markerContent = document.getElementById('marker-dropdown-content');
  const markerArrow = document.getElementById('marker-arrow');

  if (markerToggle) {
    markerToggle.addEventListener('click', () => {
      state.isMarkerMenuOpen = !state.isMarkerMenuOpen;
      markerContent.classList.toggle('hidden', !state.isMarkerMenuOpen);
      markerArrow.classList.toggle('open', state.isMarkerMenuOpen);
    });
  }

  // 7. Botón Entrar a la choza en overlay
  document.getElementById('enter-choza-btn')?.addEventListener('click', () => {
    enterInteriorCabin();
  });

  // 8. Botón Volver a escanear en vista interior
  document.getElementById('back-to-scan-btn')?.addEventListener('click', () => {
    exitInteriorCabin();
  });

  // 9. Diálogo modal cerrar
  document.getElementById('close-dialog-btn')?.addEventListener('click', () => {
    closeModelDialog();
  });

  // 10. Escuchar eventos de marcadores emitidos por A-Frame registerevents
  window.addEventListener('ar-marker-found', handleMarkerFound);
  window.addEventListener('ar-marker-lost', handleMarkerLost);

  // 11. Listeners de pantalla / resize
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);

  // 12. Configurar touch controls para interior 360
  setupTouchPanControls();

  // 13. Render inicial
  setLanguage(state.lang);
  renderMarkerMenu();
  checkOrientation();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof process === 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    i18n,
    experiences,
    state,
    t,
    setLanguage,
    showScreen,
    getActiveExperience,
    selectExperience,
    resetExperience,
    updateStatusText,
    handleMarkerFound,
    handleMarkerLost,
    enterInteriorCabin,
    exitInteriorCabin,
    loadScript,
    ensureARScriptsLoaded,
    ensureModelViewerLoaded,
    OFFLINE_ASSETS_TO_PRELOAD
  };
}
