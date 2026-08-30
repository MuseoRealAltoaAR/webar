// ============================================================
// i18n.js — Funciones de internacionalización
// ============================================================

// Resuelve una clave anidada en el diccionario i18n (ej. 'ar.status.loading')
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

  if (typeof document !== 'undefined') {
    // Marcar botón activo
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
