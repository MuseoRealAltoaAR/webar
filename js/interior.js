// ============================================================
// interior.js — Vista interior 360: giroscopio, touch, modal
// ============================================================

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

// --- RENDER DE PIEZAS INTERACTIVAS EN LA MESA ---
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
  // Cargar <model-viewer> bajo demanda
  await ensureModelViewerLoaded();

  const modal = document.getElementById('model-dialog');
  const viewer = document.getElementById('main-model-viewer');
  const titleEl = document.getElementById('modal-piece-title');
  const descEl = document.getElementById('modal-piece-desc');
  const dimEl = document.getElementById('modal-piece-dimensions');
  const weightEl = document.getElementById('modal-piece-weight');
  const materialEl = document.getElementById('modal-piece-material');
  const locationEl = document.getElementById('modal-piece-location');
  const interiorBg = document.getElementById('interior-bg');

  if (titleEl) titleEl.textContent = t(elem.nameKey);
  if (descEl) descEl.textContent = t(elem.descKey);
  if (dimEl) dimEl.textContent = t(`element.${elem.id}.dimensions`) || '—';
  if (weightEl) weightEl.textContent = t(`element.${elem.id}.weight`) || '—';
  if (materialEl) materialEl.textContent = t(`element.${elem.id}.material`) || '—';
  if (locationEl) locationEl.textContent = t(`element.${elem.id}.location`) || '—';
  if (interiorBg) interiorBg.classList.add('blurred');

  if (modal) modal.classList.remove('hidden');

  if (viewer) {
    const absoluteGlbUrl = new URL(elem.glb, window.location.href).href;
    console.log('[3D Viewer] Cargando modelo GLB desde:', absoluteGlbUrl);
    viewer.src = absoluteGlbUrl;
    viewer.setAttribute('src', absoluteGlbUrl);
    if (typeof viewer.dismissPoster === 'function') {
      viewer.dismissPoster();
    }
  }
}

function closeModelDialog() {
  const modal = document.getElementById('model-dialog');
  const viewer = document.getElementById('main-model-viewer');
  const interiorBg = document.getElementById('interior-bg');

  if (modal) modal.classList.add('hidden');
  if (viewer) {
    viewer.src = '';
    viewer.removeAttribute('src');
  }
  if (interiorBg) interiorBg.classList.remove('blurred');
}

// --- GIROSCOPIO PARA PANORAMA 360 ---
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

// --- TOUCH DRAG PARA PANORAMA 360 ---
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

// --- SOLICITUD DE PERMISOS DE ORIENTACIÓN (iOS) ---
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { enterInteriorCabin, exitInteriorCabin, renderInteriorElements, openModelDialog, closeModelDialog, handleDeviceOrientation, setupTouchPanControls, requestDeviceOrientation };
}
