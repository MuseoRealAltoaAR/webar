const { describe, it, beforeEach, before } = require('node:test');
const assert = require('node:assert');

// Mock global DOM environment
before(() => {
  const elements = new Map();
  function getOrCreateEl(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, force) {
            if (force === undefined) {
              if (this.classes.has(c)) this.classes.delete(c);
              else this.classes.add(c);
            } else if (force) {
              this.classes.add(c);
            } else {
              this.classes.delete(c);
            }
          },
          contains(c) { return this.classes.has(c); }
        },
        style: {},
        innerHTML: '',
        textContent: '',
        src: '',
        setAttribute(k, v) { this[k] = v; },
        removeAttribute(k) { delete this[k]; },
        appendChild(child) {},
        addEventListener(event, fn) {}
      });
    }
    return elements.get(id);
  }

  global.document = {
    getElementById: (id) => getOrCreateEl(id),
    querySelectorAll: () => [],
    createElement: (tag) => ({
      tagName: tag,
      classList: { add: ()=>{}, remove: ()=>{}, toggle: ()=>{} },
      style: {},
      addEventListener: ()=>{}
    }),
    addEventListener: ()=>{}
  };

  global.window = {
    innerWidth: 800,
    innerHeight: 600,
    addEventListener: ()=>{},
    dispatchEvent: ()=>{}
  };
});

const {
  state,
  selectExperience,
  resetExperience,
  handleMarkerFound,
  handleMarkerLost,
  enterInteriorCabin,
  exitInteriorCabin,
  openChozaModelDialog
} = require('../app.js');

describe('Lógica de Estado, Eventos de Marcador y Vistas de la Aplicación', () => {
  beforeEach(() => {
    state.lang = 'es';
    state.currentTab = 'inicio';
    state.arStarted = false;
    state.activeExperienceId = 'choza_realalto';
    state.isLandscape = true;
    state.markerVisible = false;
    state.interiorActive = false;
    state.statusMode = 'scanning';
    state.panoramaOffsetX = 0;
    state.lastYawDeg = null;
  });

  it('selectExperience debe actualizar la experiencia activa y restablecer el escáner', () => {
    selectExperience('choza2_realalto');
    assert.strictEqual(state.activeExperienceId, 'choza2_realalto');
    assert.strictEqual(state.markerVisible, false);
  });

  it('resetExperience debe reiniciar la visibilidad del marcador', () => {
    state.markerVisible = true;
    resetExperience();
    assert.strictEqual(state.markerVisible, false);
    assert.strictEqual(state.statusMode, 'resetting');
  });

  it('handleMarkerFound debe detectar el marcador correspondiente a la experiencia activa', () => {
    state.arStarted = true;
    state.isLandscape = true;
    state.interiorActive = false;
    state.activeExperienceId = 'choza_realalto'; // Requiere 'hiro'

    // Evento con preset HIRO
    handleMarkerFound({ detail: { preset: 'hiro', id: 'marker-hiro' } });

    assert.strictEqual(state.markerVisible, true);
    assert.strictEqual(state.statusMode, 'detected');
  });

  it('handleMarkerFound debe ignorar un marcador que no coincide con la experiencia activa', () => {
    state.arStarted = true;
    state.isLandscape = true;
    state.interiorActive = false;
    state.activeExperienceId = 'choza_realalto'; // Requiere 'hiro'

    // Evento con preset KANJI (no coincide)
    handleMarkerFound({ detail: { preset: 'kanji', id: 'marker-kanji' } });

    assert.strictEqual(state.markerVisible, false);
  });

  it('handleMarkerLost debe actualizar el estado a búsqueda cuando se pierde el marcador', () => {
    state.arStarted = true;
    state.isLandscape = true;
    state.markerVisible = true;
    state.activeExperienceId = 'choza_realalto';

    handleMarkerLost({ detail: { preset: 'hiro', id: 'marker-hiro' } });

    assert.strictEqual(state.markerVisible, false);
    assert.strictEqual(state.statusMode, 'searching');
  });

  it('enterInteriorCabin y exitInteriorCabin deben alternar el modo 360 correctamente', () => {
    enterInteriorCabin();
    assert.strictEqual(state.interiorActive, true);
    assert.strictEqual(state.panoramaOffsetX, 0);

    exitInteriorCabin();
    assert.strictEqual(state.interiorActive, false);
  });

  it('openChozaModelDialog debe cargar y configurar el modelo choza.glb en el visor 3D', async () => {
    await openChozaModelDialog();
    const modal = document.getElementById('model-dialog');
    const viewer = document.getElementById('main-model-viewer');
    const titleEl = document.getElementById('modal-piece-title');
    assert.ok(modal.classList.contains('hidden') === false, 'El modal 3D debe mostrarse');
    assert.ok(viewer.src.includes('choza.glb'), 'El viewer debe tener cargado el modelo choza.glb');
    assert.strictEqual(titleEl.textContent, 'Choza Real Alto');
  });
});
