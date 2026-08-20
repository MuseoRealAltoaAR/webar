const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { OFFLINE_ASSETS_TO_PRELOAD } = require('../app.js');

describe('Recursos Offline y Precarga del Service Worker', () => {
  it('OFFLINE_ASSETS_TO_PRELOAD debe ser un arreglo de recursos', () => {
    assert.ok(Array.isArray(OFFLINE_ASSETS_TO_PRELOAD));
    assert.ok(OFFLINE_ASSETS_TO_PRELOAD.length > 10);
  });

  it('todos los archivos locales listados en OFFLINE_ASSETS_TO_PRELOAD deben existir en disco', () => {
    const rootDir = path.resolve(__dirname, '..');

    OFFLINE_ASSETS_TO_PRELOAD.forEach(assetPath => {
      // Ignorar URLs remotas de CDNs (https://)
      if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
        return;
      }

      // Resolver rutas locales relativas
      let normalized = assetPath;
      if (normalized === './') normalized = 'index.html';
      if (normalized.startsWith('./')) normalized = normalized.substring(2);

      const fullPath = path.join(rootDir, normalized);
      assert.ok(fs.existsSync(fullPath), `Archivo para caché offline no encontrado: ${assetPath} (Ruta: ${fullPath})`);
    });
  });

  it('el Service Worker sw.js debe existir y contener la versión actual de la caché', () => {
    const swPath = path.resolve(__dirname, '../sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js debe existir');

    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.ok(swContent.includes('CACHE_NAME'), 'sw.js debe definir CACHE_NAME');
    assert.ok(swContent.includes('self.addEventListener(\'install\''), 'sw.js debe manejar el evento install');
    assert.ok(swContent.includes('self.addEventListener(\'fetch\''), 'sw.js debe manejar el evento fetch');
  });
});
