const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { experiences, getActiveExperience, state } = require('../app.js');

describe('Estructura de Datos e Integridad de Experiencias WebAR', () => {
  it('debe contener al menos 2 experiencias arqueológicas', () => {
    assert.ok(Array.isArray(experiences), 'experiences debe ser un Array');
    assert.ok(experiences.length >= 2, 'Deben existir al menos 2 experiencias configuradas');
  });

  it('cada experiencia debe tener ID, preset de marcador, scanImage y capa de entorno', () => {
    experiences.forEach((exp, idx) => {
      assert.ok(exp.id, `Experiencia #${idx} debe tener id`);
      assert.ok(exp.markerPreset, `Experiencia #${idx} debe tener markerPreset`);
      assert.ok(exp.scanImage, `Experiencia #${idx} debe tener scanImage`);
      assert.ok(exp.layer, `Experiencia #${idx} debe tener layer`);
      assert.ok(exp.layer.backgroundImage, `Experiencia #${idx} debe tener layer.backgroundImage`);
      assert.ok(exp.layer.foregroundImage, `Experiencia #${idx} debe tener layer.foregroundImage`);
      assert.ok(Array.isArray(exp.layer.elements), `Experiencia #${idx} debe tener un arreglo de elements`);
    });
  });

  it('todos los archivos físicos referenciados en experiences deben existir en disco', () => {
    const rootDir = path.resolve(__dirname, '..');

    experiences.forEach((exp) => {
      // 1. Imagen de escaneo
      const scanImgPath = path.join(rootDir, exp.scanImage);
      assert.ok(fs.existsSync(scanImgPath), `scanImage no encontrada: ${exp.scanImage}`);

      // 2. Fondo 360
      const bgImgPath = path.join(rootDir, exp.layer.backgroundImage);
      assert.ok(fs.existsSync(bgImgPath), `layer.backgroundImage no encontrada: ${exp.layer.backgroundImage}`);

      // 3. Mesa / Primer plano
      const fgImgPath = path.join(rootDir, exp.layer.foregroundImage);
      assert.ok(fs.existsSync(fgImgPath), `layer.foregroundImage no encontrada: ${exp.layer.foregroundImage}`);

      // 4. Elementos 3D y miniaturas
      exp.layer.elements.forEach(elem => {
        const glbPath = path.join(rootDir, elem.glb);
        assert.ok(fs.existsSync(glbPath), `Modelo 3D no encontrado: ${elem.glb}`);

        const pngPath = path.join(rootDir, elem.png);
        assert.ok(fs.existsSync(pngPath), `Miniatura PNG no encontrada: ${elem.png}`);
      });
    });
  });

  it('getActiveExperience debe retornar la experiencia activa correspondiente al estado', () => {
    state.activeExperienceId = 'choza_realalto';
    let active = getActiveExperience();
    assert.strictEqual(active.id, 'choza_realalto');
    assert.strictEqual(active.markerPreset, 'hiro');

    state.activeExperienceId = 'choza2_realalto';
    active = getActiveExperience();
    assert.strictEqual(active.id, 'choza2_realalto');
    assert.strictEqual(active.markerPreset, 'kanji');
  });

  it('getActiveExperience debe tener fallback a la primera experiencia si el ID no existe', () => {
    state.activeExperienceId = 'id_invalido';
    const active = getActiveExperience();
    assert.strictEqual(active.id, 'choza_realalto');
  });
});
