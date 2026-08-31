// ============================================================
// ar.js — Motor WebAR: cámara, A-Frame, marcadores, overlay
// ============================================================

let cameraStreamActive = false;
let arSceneInitialized = false;
let markerCooldownUntil = 0;

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

function setMarkerCooldown(ms) {
  if (ms === undefined) ms = 400;
  markerCooldownUntil = Date.now() + ms;
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
    stream.getTracks().forEach(function(t) { t.stop(); });
    cameraStreamActive = true;
    return true;
  } catch (err) {
    console.error('[WebAR] Permiso de cámara no concedido o error:', err);
    return false;
  }
}

// --- CONSTRUIR / RECONSTRUIR ESCENA A-FRAME ---
// Destruye y recrea siempre para garantizar que la cámara se reinicia limpiamente.
function buildARScene() {
  const container = document.getElementById('ar-scene-container');
  if (!container) return;

  container.innerHTML = '';

  const markerHTML = experiences.map(function(exp) {
    return '<a-marker id="marker-' + exp.id + '" preset="' + (exp.markerPreset || 'hiro') + '" registerevents></a-marker>';
  }).join('\n    ');

  container.innerHTML =
    '<a-scene id="aframe-scene" embedded ' +
    'arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; cameraParametersUrl: assets/data/camera_para.dat;" ' +
    'vr-mode-ui="enabled: false" ' +
    'renderer="logarithmicDepthBuffer: true; colorManagement: true;">' +
    '\n    ' + markerHTML +
    '\n    <a-entity camera>' +
    '\n      <a-cursor raycaster="objects: a-image, a-entity" cursor="fuse: false" visible="false"></a-cursor>' +
    '\n    </a-entity>' +
    '\n  </a-scene>';

  arSceneInitialized = true;

  setTimeout(function() {
    window.dispatchEvent(new Event('resize'));
  }, 400);
}

// --- INICIO DEL TRACKING AR ---
async function startARTracking() {
  state.arStarted = true;
  checkOrientation();

  const statusDot = document.getElementById('status-dot');
  if (statusDot) statusDot.classList.add('active');

  if (arSceneInitialized) {
    state.statusMode = 'scanning';
    updateStatusText();
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 200);
    return;
  }

  state.statusMode = 'loading';
  updateStatusText();

  if (!cameraStreamActive) {
    const cameraGranted = await requestCameraAccess();
    if (!cameraGranted) {
      state.statusMode = 'cameraError';
      updateStatusText();
      alert(state.lang === 'es'
        ? 'Se requiere acceso a la cámara para escanear marcadores WebAR. Por favor permite los permisos de cámara en tu navegador.'
        : 'Camera permission is required to scan WebAR markers. Please grant permissions in your browser.');
      return;
    }
  }

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

  buildARScene();

  state.statusMode = 'scanning';
  updateStatusText();
  if (typeof requestDeviceOrientation === 'function') {
    requestDeviceOrientation();
  }
}

// --- RESET DE EXPERIENCIA ---
function resetExperience() {
  state.markerVisible = false;
  state.interiorActive = false;
  state.statusMode = 'resetting';
  updateStatusText();

  const fixedOverlay = document.getElementById('fixed-choza-overlay');
  if (fixedOverlay) fixedOverlay.classList.add('hidden');

  setTimeout(function() {
    state.statusMode = 'scanning';
    updateStatusText();
    window.dispatchEvent(new Event('resize'));
  }, 200);
}

// --- MENÚ DE MARCADORES ---
function renderMarkerMenu() {
  const container = document.getElementById('marker-dropdown-content');
  if (!container) return;
  container.innerHTML = '';

  experiences.forEach(function(exp) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marker-pill interactive ' + (exp.id === state.activeExperienceId ? 'active' : '');
    btn.textContent = (exp.markerLabel || exp.markerPreset.toUpperCase()) + ' - ' + t(exp.nameKey);
    btn.addEventListener('click', function() {
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

// --- DETECCIÓN DE MARCADORES ---
function handleMarkerFound(event) {
  if (!state.arStarted || state.interiorActive) return;

  // Si aún estamos en cooldown del botón volver a escanear, diferir la detección para no perder el evento único de AR.js
  if (Date.now() < markerCooldownUntil) {
    const remaining = Math.max(50, markerCooldownUntil - Date.now() + 50);
    setTimeout(function() {
      if (state.arStarted && !state.interiorActive) {
        handleMarkerFound(event);
      }
    }, remaining);
    return;
  }

  const detail = event.detail || {};
  const detectedId = (detail.id || '').toLowerCase();
  const detectedPreset = (detail.preset || '').toLowerCase();

  // Prioridad 1: ID exacto
  let matchedExp = experiences.find(function(exp) {
    return detectedId === ('marker-' + exp.id).toLowerCase();
  });

  // Prioridad 2: Preset
  if (!matchedExp && detectedPreset) {
    matchedExp = experiences.find(function(exp) {
      return detectedPreset === (exp.markerPreset || '').toLowerCase();
    });
  }

  // Prioridad 3: ID parcial
  if (!matchedExp && detectedId) {
    matchedExp = experiences.find(function(exp) {
      return detectedId.includes(exp.id.toLowerCase());
    });
  }

  if (!matchedExp) {
    console.log('[WebAR] Marcador no reconocido:', detail);
    return;
  }

  if (state.activeExperienceId !== matchedExp.id) {
    state.activeExperienceId = matchedExp.id;
    renderMarkerMenu();
  }

  state.markerVisible = true;
  state.statusMode = 'detected';
  updateStatusText();

  if (matchedExp.directInterior || matchedExp.id === 'entierro_realalto') {
    enterInteriorCabin();
  } else {
    showFixedChozaOverlay(matchedExp);
  }
}

function handleMarkerLost(event) {
  const detail = event.detail || {};
  const activeExp = getActiveExperience();
  const detectedId = (detail.id || '').toLowerCase();
  const detectedPreset = (detail.preset || '').toLowerCase();

  const isMatching = detectedId === ('marker-' + activeExp.id).toLowerCase() ||
                     detectedPreset === (activeExp.markerPreset || '').toLowerCase() ||
                     (detectedId && detectedId.includes(activeExp.id.toLowerCase()));

  if (isMatching) {
    state.markerVisible = false;
    if (state.arStarted && !state.interiorActive) {
      state.statusMode = 'searching';
      updateStatusText();
    }
  }
}

// --- OVERLAY DE CHOZA FIJA ---
function showFixedChozaOverlay(exp) {
  const overlay = document.getElementById('fixed-choza-overlay');
  const img = document.getElementById('fixed-choza-img');
  if (overlay && img) {
    img.src = exp.scanImage;
    overlay.classList.remove('hidden');
  }
}

// --- ORIENTACIÓN ---
function checkOrientation() {
  state.isLandscape = window.innerWidth > window.innerHeight;
  const warningEl = document.getElementById('orientation-warning');
  const dropdownEl = document.getElementById('marker-dropdown-wrapper');

  if (warningEl) warningEl.classList.add('hidden');
  if (dropdownEl) dropdownEl.classList.remove('hidden');

  if (state.arStarted) {
    state.statusMode = 'scanning';
    updateStatusText();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getActiveExperience,
    startARTracking,
    buildARScene,
    setMarkerCooldown,
    resetExperience,
    renderMarkerMenu,
    selectExperience,
    updateStatusText,
    handleMarkerFound,
    handleMarkerLost,
    showFixedChozaOverlay,
    checkOrientation
  };
}
