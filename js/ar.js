// ============================================================
// ar.js — Motor WebAR: cámara, A-Frame, marcadores, overlay
// ============================================================

let cameraStreamActive = false;
let arSceneInitialized = false;

// --- HELPERS ---
function getActiveExperience() {
  return experiences.find(exp => exp.id === state.activeExperienceId) || experiences[0];
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

// --- ACCESO A CÁMARA ---
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
    // Liberamos el stream temporal para que AR.js tome control exclusivo
    stream.getTracks().forEach(t => t.stop());
    cameraStreamActive = true;
    return true;
  } catch (err) {
    console.error('[WebAR] Permiso de cámara no concedido o error:', err);
    return false;
  }
}

// --- INICIO DEL TRACKING AR ---
async function startARTracking() {
  state.arStarted = true;
  state.statusMode = 'loading';
  updateStatusText();

  const statusDot = document.getElementById('status-dot');
  if (statusDot) statusDot.classList.add('active');

  checkOrientation();

  // 1. Solicitar permisos de cámara
  const cameraGranted = await requestCameraAccess();
  if (!cameraGranted) {
    state.statusMode = 'cameraError';
    updateStatusText();
    alert(state.lang === 'es'
      ? 'Se requiere acceso a la cámara para escanear marcadores WebAR. Por favor permite los permisos de cámara en tu navegador.'
      : 'Camera permission is required to scan WebAR markers. Please grant permissions in your browser.');
    return;
  }

  // 2. Cargar librerías AR (A-Frame y AR.js)
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

  // 3. Inyectar escena A-Frame si aún no existe
  const container = document.getElementById('ar-scene-container');
  if (container && !arSceneInitialized) {
    container.innerHTML = `
      <a-scene 
        id="aframe-scene"
        embedded 
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; colorManagement: true;">
        
        <!-- Marcadores generados automáticamente desde experiences[] en config.js -->
        ${experiences.map(exp => {
          if (exp.markerType === 'pattern') {
            // Marcador con patrón personalizado (.patt)
            return `<a-marker id="marker-${exp.id}" type="pattern" url="${exp.markerUrl}" registerevents></a-marker>`;
          }
          // Marcador preset estándar de AR.js (hiro, kanji, etc.)
          return `<a-marker id="marker-${exp.id}" preset="${exp.markerPreset}" registerevents></a-marker>`;
        }).join('\n        ')}

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

// --- RESET DE EXPERIENCIA ---
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

// --- MENÚ DE MARCADORES ---
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

// --- DETECCIÓN DE MARCADORES (Custom Events desde A-Frame) ---
function handleMarkerFound(event) {
  if (!state.isLandscape || !state.arStarted || state.interiorActive) return;

  const detail = event.detail || {};
  const activeExp = getActiveExperience();
  const detectedPreset = (detail.preset || '').toLowerCase();
  const detectedId = (detail.id || '').toLowerCase();

  // Coincide si el id del nodo A-Frame o el preset baten con la experiencia activa
  const isMatching = detectedId === `marker-${activeExp.id}` ||
                     detectedPreset === (activeExp.markerPreset || '').toLowerCase();

  if (isMatching) {
    state.markerVisible = true;
    state.statusMode = 'detected';
    updateStatusText();

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

  const isMatching = detectedId === `marker-${activeExp.id}` ||
                     detectedPreset === (activeExp.markerPreset || '').toLowerCase();

  if (isMatching) {
    state.markerVisible = false;
    if (state.arStarted && !state.interiorActive) {
      state.statusMode = 'searching';
      updateStatusText();
    }
  }
}

// --- OVERLAY DE CHOZA FIJA AL DETECTAR MARCADOR ---
function showFixedChozaOverlay(exp) {
  const overlay = document.getElementById('fixed-choza-overlay');
  const img = document.getElementById('fixed-choza-img');
  if (overlay && img) {
    img.src = exp.scanImage;
    overlay.classList.remove('hidden');
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
