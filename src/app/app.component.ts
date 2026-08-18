import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ArViewComponent } from './features/ar-view/ar-view.component';
import { CabinViewComponent } from './features/cabin-view/cabin-view.component';
import { HomeComponent } from './pages/home/home.component';
import { InformationComponent } from './pages/information/information.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StateService } from './core/services/state.service';
import { I18nService } from './core/services/i18n.service';
import { TPipe } from './core/pipes/t.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ArViewComponent, CabinViewComponent, HomeComponent, InformationComponent, SidebarComponent, TPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit, OnDestroy {
  showLoadingScreen = true;
  showFixedChoza = false;
  isLandscapeMode = true;
  isInteriorActive = false;
  activeExperienceId = '';
  activeMarkerId = '';
  activeScanImage = '';
  detectedExperienceId = '';
  private subscriptions = new Subscription();

  private onMarkerFound = (event: Event) => {
    if (!this.isLandscapeMode) {
      this.showFixedChoza = false;
      return;
    }

    const customEvent = event as CustomEvent<{ id: string }>;
    if (customEvent.detail?.id === this.activeMarkerId) {
      this.showFixedChoza = true;
      this.detectedExperienceId = this.activeExperienceId;
      return;
    }

    if (customEvent.detail?.id && customEvent.detail.id !== this.activeMarkerId) {
      this.showFixedChoza = false;
    }
  };

  private onMarkerLost = (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string }>;
    if (customEvent.detail?.id === this.activeMarkerId) {
      // Keep the detected experience latched until the user selects a new one.
      return;
    }
  };

  private onEnterChozaRequest = () => {
    if (!this.showFixedChoza) {
      return;
    }
    this.startChozaZoomAndFade();
  };

  private onBackToHomeRequest = () => {
    this.returnToHome();
  };

  private onBackToScanRequest = () => {
    this.returnToScanner();
  };

  private onArResetRequest = () => {
    this.showFixedChoza = false;
    this.detectedExperienceId = '';
  };

  private onOrientationChange = () => {
    this.isLandscapeMode = window.innerWidth > window.innerHeight;
    if (!this.isLandscapeMode) {
      this.showFixedChoza = false;
      this.detectedExperienceId = '';
    }
  };

  loadingPercentage = 0;
  loadingStatusText = 'Iniciando descarga de modelos 3D y assets...';
  private preloadingFinished = false;

  private getAutoDiscoveredAssets(): { url: string; type: string; label: string }[] {
    const assetMap = new Map<string, { url: string; type: string; label: string }>();

    const addAsset = (url: string, type?: string, label?: string) => {
      if (!url || assetMap.has(url)) return;
      assetMap.set(url, {
        url,
        type: type || (url.endsWith('.glb') ? 'model' : 'image'),
        label: label || url.split('/').pop() || url
      });
    };

    // Base visual shell assets
    addAsset('assets/img/background.webp', 'image', 'Fondo');
    addAsset('assets/img/logo.webp', 'image', 'Logo');
    addAsset('assets/icon/favicon.ico', 'image', 'Icono');
    addAsset('assets/shapes.svg', 'image', 'Shapes');

    // Auto-discover all assets from configured experiences & 3D models
    if (this.stateService && this.stateService.experiences) {
      this.stateService.experiences.forEach(exp => {
        if (exp.scanImage) addAsset(exp.scanImage, 'image', exp.name);
        if (exp.layer) {
          if (exp.layer.mainImage) addAsset(exp.layer.mainImage, 'image', exp.layer.name);
          if (exp.layer.backgroundImage) addAsset(exp.layer.backgroundImage, 'image', exp.layer.name);
          if (exp.layer.foregroundImage) addAsset(exp.layer.foregroundImage, 'image', 'Mesa');
          if (exp.layer.elements) {
            exp.layer.elements.forEach(el => {
              if (el.glb) addAsset(el.glb, 'model', `Modelo 3D ${el.name} (.glb)`);
              if (el.png) addAsset(el.png, 'image', `Miniatura ${el.name}`);
            });
          }
        }
      });
    }

    return Array.from(assetMap.values());
  }

  constructor(public stateService: StateService, private i18n: I18nService) {}

  async ngOnInit() {
    try {
      await this.i18n.init();
    } catch {
      // Continue with fallback keys if i18n files fail to load.
    }

    const activeExperience = this.stateService.getActiveExperience();
    this.activeExperienceId = activeExperience.id;
    this.activeMarkerId = `marker-${activeExperience.markerPreset}`;
    this.activeScanImage = activeExperience.scanImage;

    this.onOrientationChange();
    window.addEventListener('resize', this.onOrientationChange as EventListener);
    window.addEventListener('orientationchange', this.onOrientationChange as EventListener);

    window.addEventListener('ar-marker-found', this.onMarkerFound as EventListener);
    window.addEventListener('ar-marker-lost', this.onMarkerLost as EventListener);
    window.addEventListener('enter-choza-request', this.onEnterChozaRequest as EventListener);
    window.addEventListener('back-to-home-request', this.onBackToHomeRequest as EventListener);
    window.addEventListener('back-to-scan-request', this.onBackToScanRequest as EventListener);
    window.addEventListener('ar-reset-request', this.onArResetRequest as EventListener);

    this.subscriptions.add(
      this.stateService.activeExperienceId$.subscribe(experienceId => {
        this.activeExperienceId = experienceId;
        const activeExp = this.stateService.getActiveExperience();
        this.activeMarkerId = `marker-${activeExp.markerPreset}`;
        this.activeScanImage = activeExp.scanImage;
        this.showFixedChoza = false;
        this.detectedExperienceId = '';
      })
    );

    this.subscriptions.add(
      this.stateService.arStarted$.subscribe(started => {
        if (started) {
          this.showFixedChoza = false;
          this.detectedExperienceId = '';
        }
      })
    );

    this.subscriptions.add(
      this.stateService.interiorActive$.subscribe(active => {
        this.isInteriorActive = active;
        if (active) {
          this.showFixedChoza = false;
          this.detectedExperienceId = '';
        }
      })
    );

    this.initServiceWorkerAndPreload();
  }

  private initServiceWorkerAndPreload() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          console.log('[Service Worker Angular] Registrado en el scope:', reg.scope);
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'PRECACHE_PROGRESS') {
              const pct = event.data.percentage;
              this.loadingPercentage = pct;
              this.loadingStatusText = `Guardando en caché offline (${pct}%)...`;
            } else if (event.data && event.data.type === 'PRECACHE_COMPLETE') {
              this.dismissLoading();
            }
          });

          if (navigator.serviceWorker.controller) {
            const assets = this.getAutoDiscoveredAssets();
            navigator.serviceWorker.controller.postMessage({
              type: 'CACHE_DYNAMIC_ASSETS',
              assets: assets.map(a => a.url)
            });
          }
        })
        .catch(err => {
          console.error('[Service Worker Angular] Error al registrar:', err);
        });
    }

    this.startAssetPreloading();

    // Fallback de seguridad
    setTimeout(() => {
      if (!this.preloadingFinished) {
        this.dismissLoading();
      }
    }, 10000);
  }

  private async startAssetPreloading() {
    const assets = this.getAutoDiscoveredAssets();
    const total = assets.length;
    let loaded = 0;

    const promises = assets.map(async (asset) => {
      try {
        if (asset.type === 'image') {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = asset.url;
          });
        } else {
          const res = await fetch(asset.url);
          if (res.ok) await res.blob();
        }
      } catch (e) {
        console.warn(`[Asset Preload] Error en ${asset.url}:`, e);
      } finally {
        loaded++;
        this.loadingPercentage = Math.round((loaded / total) * 100);
        this.loadingStatusText = `Descargando: ${asset.label}`;
      }
    });

    await Promise.all(promises);
    this.dismissLoading();
  }

  private dismissLoading() {
    if (this.preloadingFinished) return;
    this.preloadingFinished = true;

    this.loadingPercentage = 100;
    this.loadingStatusText = '¡Modelos y recursos listos!';

    setTimeout(() => {
      const element = document.getElementById('loading-screen');
      if (element) {
        element.style.opacity = '0';
      }
      setTimeout(() => {
        this.showLoadingScreen = false;
      }, 800);
    }, 400);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();

    window.removeEventListener('resize', this.onOrientationChange as EventListener);
    window.removeEventListener('orientationchange', this.onOrientationChange as EventListener);

    window.removeEventListener('ar-marker-found', this.onMarkerFound as EventListener);
    window.removeEventListener('ar-marker-lost', this.onMarkerLost as EventListener);
    window.removeEventListener('enter-choza-request', this.onEnterChozaRequest as EventListener);
    window.removeEventListener('back-to-home-request', this.onBackToHomeRequest as EventListener);
    window.removeEventListener('back-to-scan-request', this.onBackToScanRequest as EventListener);
    window.removeEventListener('ar-reset-request', this.onArResetRequest as EventListener);
  }

  enterChozaFromOverlay() {
    if (!this.isLandscapeMode) {
      return;
    }
    this.startChozaZoomAndFade();
  }

  private startChozaZoomAndFade() {
    const chozaImage = document.querySelector('.fixed-choza-image') as HTMLElement | null;
    const enterBeforeFadeMs = 950;

    if (!chozaImage) {
      this.transitionToCabin();
      return;
    }

    chozaImage.classList.add('zoom-enter');
    setTimeout(() => {
      this.transitionToCabin();
    }, enterBeforeFadeMs);
  }

  private transitionToCabin() {
    this.deactivateArCameraAndRenderer();

    this.showFixedChoza = false;
    this.detectedExperienceId = '';
    this.stateService.setInteriorActive(true);
  }

  private deactivateArCameraAndRenderer() {
    const renderNodes = document.querySelectorAll<HTMLElement>('a-scene, video, .a-canvas, canvas.a-canvas');
    renderNodes.forEach(node => {
      node.style.display = 'none';
      node.style.visibility = 'hidden';
      node.style.opacity = '0';
    });

    const videos = document.querySelectorAll<HTMLVideoElement>('video');
    videos.forEach(video => {
      const stream = video.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    });
  }

  private returnToHome() {
    this.showFixedChoza = false;
    this.detectedExperienceId = '';
    this.stateService.setInteriorActive(false);
    this.stateService.setArStarted(false);
  }

  private returnToScanner() {
    this.showFixedChoza = false;
    this.detectedExperienceId = '';
    this.stateService.setInteriorActive(false);
    this.stateService.setMarkerVisible(false);
    this.stateService.setModelLoaded(false);
    this.stateService.setModelAnchored(false);

    // Remount scanner to reset AR.js tracking/camera state reliably.
    this.stateService.setArStarted(false);
    setTimeout(() => {
      this.stateService.setArStarted(true);
    }, 180);
  }

  get isFixedScanOverlayVisible(): boolean {
    return !this.isInteriorActive && this.isLandscapeMode && this.stateService.getActiveExperienceId() === this.detectedExperienceId && !!this.detectedExperienceId;
  }
}
