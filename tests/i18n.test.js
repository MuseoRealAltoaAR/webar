const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { i18n, t, state, setLanguage } = require('../app.js');

describe('Módulo de Internacionalización (i18n)', () => {
  beforeEach(() => {
    state.lang = 'es';
  });

  it('debe contener los idiomas español (es) e inglés (en)', () => {
    assert.ok(i18n.es, 'El diccionario en español debe existir');
    assert.ok(i18n.en, 'El diccionario en inglés debe existir');
  });

  it('debe tener paridad total de claves entre español e inglés', () => {
    function getKeys(obj, prefix = '') {
      let keys = [];
      for (const [k, v] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'object' && v !== null) {
          keys = keys.concat(getKeys(v, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }

    const esKeys = getKeys(i18n.es).sort();
    const enKeys = getKeys(i18n.en).sort();

    assert.deepStrictEqual(esKeys, enKeys, 'Todas las claves de traducción deben coincidir exactamente entre ES y EN');
  });

  it('t(key) debe traducir correctamente claves anidadas en español', () => {
    state.lang = 'es';
    assert.strictEqual(t('home.pitch'), 'Guía Interactiva en Realidad Aumentada');
    assert.strictEqual(t('common.complex'), 'COMPLEJO CULTURAL');
    assert.strictEqual(t('ar.reset'), 'Reiniciar');
  });

  it('t(key) debe traducir correctamente claves anidadas en inglés', () => {
    state.lang = 'en';
    assert.strictEqual(t('home.pitch'), 'Interactive Augmented Reality Guide');
    assert.strictEqual(t('common.complex'), 'CULTURAL COMPLEX');
    assert.strictEqual(t('ar.reset'), 'Reset');
  });

  it('t(key) debe retornar la misma clave como fallback si no existe', () => {
    assert.strictEqual(t('clave.inexistente.test'), 'clave.inexistente.test');
    assert.strictEqual(t(''), '');
    assert.strictEqual(t(null), '');
  });

  it('setLanguage debe cambiar el idioma activo en el estado', () => {
    setLanguage('en');
    assert.strictEqual(state.lang, 'en');

    setLanguage('es');
    assert.strictEqual(state.lang, 'es');
  });

  it('setLanguage no debe aceptar idiomas no soportados', () => {
    setLanguage('es');
    setLanguage('fr');
    assert.strictEqual(state.lang, 'es', 'El idioma debe mantenerse en español ante código inválido');
  });

  it('debe soportar interpolación de marcador en estado de escaneo', () => {
    state.lang = 'es';
    const template = t('ar.status.scanning');
    const result = template.replace('{marker}', 'HIRO');
    assert.strictEqual(result, 'Escaneando marcador [HIRO]');
  });
});
