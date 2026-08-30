// Legacy proxy for tests / backward compatibility in Node.js
if (typeof module !== 'undefined' && module.exports) {
  const config = require('./js/config.js');
  global.i18n = config.i18n;
  global.experiences = config.experiences;
  global.state = config.state;
  global.OFFLINE_ASSETS_TO_PRELOAD = config.OFFLINE_ASSETS_TO_PRELOAD;

  const loader = require('./js/loader.js');
  const i18nModule = require('./js/i18n.js');
  global.t = i18nModule.t;
  global.setLanguage = i18nModule.setLanguage;

  const ar = require('./js/ar.js');
  global.getActiveExperience = ar.getActiveExperience;
  global.startARTracking = ar.startARTracking;
  global.resetExperience = ar.resetExperience;
  global.renderMarkerMenu = ar.renderMarkerMenu;
  global.selectExperience = ar.selectExperience;
  global.updateStatusText = ar.updateStatusText;
  global.handleMarkerFound = ar.handleMarkerFound;
  global.handleMarkerLost = ar.handleMarkerLost;
  global.showFixedChozaOverlay = ar.showFixedChozaOverlay;
  global.checkOrientation = ar.checkOrientation;

  const interior = require('./js/interior.js');
  global.enterInteriorCabin = interior.enterInteriorCabin;
  global.exitInteriorCabin = interior.exitInteriorCabin;
  global.renderInteriorElements = interior.renderInteriorElements;
  global.openModelDialog = interior.openModelDialog;
  global.closeModelDialog = interior.closeModelDialog;

  const ui = require('./js/ui.js');
  global.showScreen = ui.showScreen;
  global.hideLoadingScreen = ui.hideLoadingScreen;

  const main = require('./js/main.js');

  module.exports = {
    ...config,
    ...loader,
    ...i18nModule,
    ...ar,
    ...interior,
    ...ui,
    ...main
  };
}
