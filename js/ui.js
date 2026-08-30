// ============================================================
// ui.js — Navegación, sidebar, loading screen
// ============================================================

// --- NAVEGACIÓN Y PANTALLAS ---
function showScreen(tabName) {
  state.currentTab = tabName;

  // Ocultar todas las vistas
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

// --- PANTALLA DE CARGA ---
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
