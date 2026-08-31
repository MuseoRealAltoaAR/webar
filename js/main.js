// ============================================================
// main.js — Punto de entrada: inicialización y event listeners
// ============================================================

function initializeApp() {
  // 1. Ocultar splash y activar Service Worker en segundo plano
  hideLoadingScreen();
  initOfflineSupport();

  // Precargar componente 3D model-viewer y assets de experiencia en segundo plano
  ensureModelViewerLoaded().catch(console.warn);

  if (typeof fetch !== 'undefined') {
    // Precargar decodificadores WASM Draco para decodificación 3D offline
    fetch('https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js').catch(() => {});
    fetch('https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm').catch(() => {});

    // Precargar modelo 3D y miniatura de la choza y del entierro
    fetch('assets/models/choza.glb').catch(() => {});
    fetch('assets/models/chozauno.webp').catch(() => {});
    fetch('assets/models/entierro.glb').catch(() => {});
    fetch('assets/img/entierrop.webp').catch(() => {});
    fetch('assets/img/terreno.webp').catch(() => {});

    if (typeof experiences !== 'undefined') {
      experiences.forEach(exp => {
        if (exp.layer?.elements) {
          exp.layer.elements.forEach(el => {
            if (el.glb) fetch(el.glb).catch(() => {});
            if (el.png) fetch(el.png).catch(() => {});
          });
        }
        if (exp.layer?.backgroundImage) fetch(exp.layer.backgroundImage).catch(() => {});
        if (exp.layer?.foregroundImage) fetch(exp.layer.foregroundImage).catch(() => {});
      });
    }
  }

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

  // 7. Botón Entrar a la choza
  document.getElementById('enter-choza-btn')?.addEventListener('click', () => {
    enterInteriorCabin();
  });

  // 8. Botón 3D (superior derecha en interior) — abre el modelo de la experiencia activa
  document.getElementById('choza-3d-btn')?.addEventListener('click', () => {
    const activeExp = getActiveExperience();
    // Buscar el primer elemento con GLB en la experiencia activa
    const firstElem = activeExp.layer?.elements?.find(el => el.glb);
    if (firstElem) {
      openModelDialog(firstElem);
    } else {
      // Fallback: abrir el modelo de la choza si no hay otro
      openChozaModelDialog();
    }
  });

  // 9. Botón Volver a escanear
  document.getElementById('back-to-scan-btn')?.addEventListener('click', () => {
    exitInteriorCabin();
  });

  // 10. Cerrar modal 3D
  document.getElementById('close-dialog-btn')?.addEventListener('click', () => {
    closeModelDialog();
  });

  // 10. Eventos de marcadores AR desde A-Frame
  window.addEventListener('ar-marker-found', handleMarkerFound);
  window.addEventListener('ar-marker-lost', handleMarkerLost);

  // 11. Resize / orientación
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);

  // 12. Touch controls para interior 360
  setupTouchPanControls();

  // 13. Render inicial
  setLanguage(state.lang);
  renderMarkerMenu();
  checkOrientation();
}

// Arrancar cuando el DOM esté listo
if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof process === 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

// Exportar para tests (Node/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp
  };
}
