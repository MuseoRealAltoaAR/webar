// ============================================================
// interior.js — Vista interior 360: giroscopio, touch, modal
// ============================================================

// --- VISTA INTERIOR DE LA CHOZA (Cabin View 360) ---
function enterInteriorCabin() {
  state.interiorActive = true;
  state.panoramaOffsetX = 0;
  state.lastYawDeg = null;

  // Ocultar AR overlay
  document.getElementById('fixed-choza-overlay')?.classList.add('hidden');
  document.getElementById('ui-ar')?.classList.add('hidden');

  // Configurar y mostrar interior
  const interiorOverlay = document.getElementById('interior-overlay');
  const interiorBg = document.getElementById('interior-bg');
  const mesaImg = document.getElementById('mesa-img');
  const tableContainer = (typeof document !== 'undefined' && typeof document.querySelector === 'function')
    ? document.querySelector('.table-container')
    : null;
  const choza3dBtn = document.getElementById('choza-3d-btn');
  const activeExp = getActiveExperience();

  if (interiorBg) {
    interiorBg.style.backgroundImage = `url('${activeExp.layer.backgroundImage}')`;
    interiorBg.classList.remove('blurred');
    if (activeExp.staticBackground || activeExp.id === 'entierro_realalto') {
      interiorBg.classList.add('static-bg');
      interiorBg.style.backgroundPosition = 'center center';
    } else {
      interiorBg.classList.remove('static-bg');
      interiorBg.style.backgroundPosition = '0px 50%';
    }
  }

  // Si no hay mesa (ej. en el terreno), ocultamos la imagen de la mesa
  if (mesaImg) {
    if (activeExp.layer.foregroundImage) {
      mesaImg.src = activeExp.layer.foregroundImage;
      mesaImg.classList.remove('hidden');
    } else {
      mesaImg.src = '';
      mesaImg.classList.add('hidden');
    }
  }

  if (tableContainer) {
    tableContainer.classList.toggle('no-table', !activeExp.layer.foregroundImage);
  }

  // El botón 3D solo visible en la experiencia de la choza
  if (choza3dBtn) {
    choza3dBtn.classList.toggle('hidden', activeExp.id !== 'choza_realalto');
    // Restablecer la imagen de la choza al entrar
    const btnImg = document.getElementById('choza-3d-btn-img');
    if (btnImg) {
      btnImg.src = 'assets/models/chozauno.webp';
    }
  }

  renderInteriorElements(activeExp.layer.elements);
  if (interiorOverlay) interiorOverlay.classList.remove('hidden');
}

function exitInteriorCabin() {
  state.interiorActive = false;
  state.markerVisible = false;
  document.getElementById('interior-overlay')?.classList.add('hidden');
  document.getElementById('fixed-choza-overlay')?.classList.add('hidden');
  document.getElementById('ui-ar')?.classList.remove('hidden');

  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.add('ar-mode');
  }

  // Activar cooldown breve para evitar re-aperturas instantáneas
  if (typeof setMarkerCooldown === 'function') {
    setMarkerCooldown(400);
  }

  state.statusMode = 'scanning';
  updateStatusText();

  // Reconstruir la escena A-Frame completa para liberar el contexto congelado de la cámara
  // Esta es la solución exacta que funcionó en el commit 9a7fde4
  if (typeof buildARScene === 'function') {
    setTimeout(function() {
      buildARScene();
    }, 100);
  }
}


// --- RENDER DE PIEZAS INTERACTIVAS EN LA MESA / TERRENO ---
function renderInteriorElements(elements) {
  const container = document.getElementById('elements-horizontal-container');
  if (!container) return;
  container.innerHTML = '';

  elements.forEach(elem => {
    const imgBtn = document.createElement('img');
    imgBtn.src = elem.png;
    imgBtn.alt = t(elem.nameKey);
    const isSingleBig = elem.id === 'entierro' || elements.length === 1;
    imgBtn.className = `${isSingleBig ? 'entierro-btn' : 'valdivia-btn'} interactive`;
    imgBtn.width = isSingleBig ? 160 : 75;
    imgBtn.height = isSingleBig ? 260 : 75;
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
  if (typeof ensureModelViewerLoaded === 'function') {
    try {
      await ensureModelViewerLoaded();
    } catch (err) {
      console.warn('[3D Viewer] Error cargando componente:', err);
    }
  }

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
    const baseUrl = (typeof window !== 'undefined' && window.location?.href) ? window.location.href : 'http://localhost/';
    const absoluteGlbUrl = new URL(elem.glb, baseUrl).href;
    console.log('[3D Viewer] Cargando modelo GLB desde:', absoluteGlbUrl);
    viewer.src = absoluteGlbUrl;
    viewer.setAttribute('src', absoluteGlbUrl);

    // Aplicar rotación personalizada si existe (ej. entierro.glb rotado -90deg en eje Y)
    if (elem.orientation) {
      viewer.setAttribute('orientation', elem.orientation);
      viewer.orientation = elem.orientation;
    } else {
      viewer.removeAttribute('orientation');
      viewer.orientation = '0deg 0deg 0deg';
    }

    if (elem.cameraOrbit) {
      viewer.setAttribute('camera-orbit', elem.cameraOrbit);
      viewer.cameraOrbit = elem.cameraOrbit;
    } else {
      viewer.setAttribute('camera-orbit', '45deg 55deg 2.5m');
      viewer.cameraOrbit = '45deg 55deg 2.5m';
    }

    // Habilitar soporte AR (Google Scene Viewer / WebXR / Quick Look)
    viewer.setAttribute('ar', '');
    viewer.setAttribute('ar-modes', 'scene-viewer webxr quick-look');
    viewer.setAttribute('ar-scale', 'auto');
    viewer.setAttribute('ar-placement', 'floor');

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
    viewer.removeAttribute('orientation');
    viewer.orientation = '0deg 0deg 0deg';
  }
  if (interiorBg) interiorBg.classList.remove('blurred');
}

// --- GIROSCOPIO PARA PANORAMA 360 ---
function handleDeviceOrientation(event) {
  if (!state.interiorActive || state.isDragging) return;
  const activeExp = getActiveExperience();
  if (activeExp.staticBackground || activeExp.id === 'entierro_realalto') return;

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
    const activeExp = getActiveExperience();
    if (activeExp.staticBackground || activeExp.id === 'entierro_realalto') return;
    state.isDragging = true;
    state.startTouchX = e.touches[0].clientX;
    state.dragStartOffsetX = state.panoramaOffsetX;
  }, { passive: true });

  overlay.addEventListener('touchmove', (e) => {
    if (!state.isDragging || !state.interiorActive) return;
    const activeExp = getActiveExperience();
    if (activeExp.staticBackground || activeExp.id === 'entierro_realalto') return;
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
    const activeExp = getActiveExperience();
    if (activeExp.staticBackground || activeExp.id === 'entierro_realalto') {
      state.isDragging = false;
      return;
    }
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

// --- APERTURA DEL MODELO 3D DE LA CHOZA ---
function openChozaModelDialog() {
  const chozaElem = {
    id: 'choza',
    nameKey: 'element.choza.name',
    descKey: 'element.choza.desc',
    glb: 'assets/models/choza.glb',
    png: 'assets/models/chozauno.webp'
  };
  return openModelDialog(chozaElem);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    enterInteriorCabin,
    exitInteriorCabin,
    renderInteriorElements,
    openModelDialog,
    closeModelDialog,
    openChozaModelDialog,
    handleDeviceOrientation,
    setupTouchPanControls,
    requestDeviceOrientation
  };
}
