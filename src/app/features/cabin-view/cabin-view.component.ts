import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StateService } from '../../core/services/state.service';
import { Layer, LayerElement } from '../../core/models/experience.model';
import { Subscription } from 'rxjs';
import { TPipe } from '../../core/pipes/t.pipe';

@Component({
  selector: 'app-cabin-view',
  templateUrl: './cabin-view.component.html',
  styleUrls: ['./cabin-view.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CabinViewComponent implements OnInit, OnDestroy {
  currentLayer!: Layer;
  activeElementId: string = '';
  showModal: boolean = false;
  selectedElement: LayerElement | null = null;
  
  private isDragging = false;
  private startTouchX = 0;
  private startTouchY = 0;
  private baseOffsetX = 0;
  private baseOffsetY = 0;
  private initialGamma: number | null = null;
  private initialBeta: number | null = null;
  private initialParallaxSaved = false;
  private touchControlsInitialized = false;
  private readonly boundParallaxHandler = this.handleParallax.bind(this);
  private subscriptions: Subscription = new Subscription();

  constructor(public stateService: StateService) {}

  ngOnInit() {
    this.currentLayer = this.stateService.getCurrentLayer();

    this.subscriptions.add(
      this.stateService.activeExperienceId$.subscribe(() => {
        this.currentLayer = this.stateService.getCurrentLayer();
        const firstElement = this.currentLayer.elements[0];
        if (firstElement) {
          this.stateService.setActiveElementId(firstElement.id);
        }
      })
    );
    
    this.subscriptions.add(
      this.stateService.activeElementId$.subscribe(id => this.activeElementId = id)
    );

    this.subscriptions.add(
      this.stateService.interiorActive$.subscribe(active => {
        if (active) {
          this.initialParallaxSaved = false;
          this.initialGamma = null;
          this.initialBeta = null;
          this.baseOffsetX = 0;
          this.baseOffsetY = 0;
          this.applyPanoramaPosition();
          this.requestOrientationPermission();
          this.setupTouchControls();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    window.removeEventListener('deviceorientation', this.boundParallaxHandler);
  }

  async requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', this.boundParallaxHandler);
        }
      } catch (error) {
        console.warn("Could not request orientation permission:", error);
      }
    } else {
      window.addEventListener('deviceorientation', this.boundParallaxHandler);
    }
  }

  handleParallax(event: DeviceOrientationEvent) {
    if (this.showModal || this.isDragging) return;

    const rawGamma = event.gamma; // Roll [-90, 90]
    const rawBeta = event.beta;   // Pitch [-180, 180]

    if (rawGamma === null || rawBeta === null) return;

    // Calibrate baseline when first entering the interior
    if (!this.initialParallaxSaved || this.initialGamma === null || this.initialBeta === null) {
      this.initialGamma = rawGamma;
      this.initialBeta = rawBeta;
      this.initialParallaxSaved = true;
      return;
    }

    // Calculate change relative to initial position
    let diffX = rawGamma - this.initialGamma;
    let diffY = rawBeta - this.initialBeta;

    // Detect orientation to swap axes if in landscape mode
    const orientationType = (screen.orientation && screen.orientation.type) || "";
    const isLandscape = orientationType.includes("landscape") || window.innerWidth > window.innerHeight;

    if (isLandscape) {
      // In landscape: tilting the phone left/right moves the Pitch (beta),
      // and tilting forward/backward moves the Roll (gamma).
      diffX = rawBeta - this.initialBeta;
      diffY = rawGamma - this.initialGamma;
    }

    const maxOffsetX = 150; // Horizontal range
    const maxOffsetY = 30;  // Vertical range
    
    // Apply sensitivity scale factor
    const targetX = -diffX * 4.5; 
    const targetY = -diffY * 2.5;

    // Clamp boundaries to prevent image edges from showing
    this.baseOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, targetX));
    this.baseOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, targetY));

    this.applyPanoramaPosition();
  }

  private applyPanoramaPosition() {
    const interiorBg = document.getElementById('interior-bg');
    if (interiorBg) {
      interiorBg.style.transform = `translate(${this.baseOffsetX}px, ${this.baseOffsetY}px) scale(1.35)`;
    }
  }

  setupTouchControls() {
    if (this.touchControlsInitialized) return;

    const overlay = document.getElementById('interior-overlay');
    if (!overlay) return;

    this.touchControlsInitialized = true;

    overlay.addEventListener('touchstart', (e: TouchEvent) => {
      if (this.showModal) return;
      this.isDragging = true;
      this.startTouchX = e.touches[0].clientX - this.baseOffsetX;
      this.startTouchY = e.touches[0].clientY - this.baseOffsetY;
    }, { passive: true });

    overlay.addEventListener('touchmove', (e: TouchEvent) => {
      if (this.showModal || !this.isDragging) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const targetX = currentX - this.startTouchX;
      const targetY = currentY - this.startTouchY;

      const maxOffsetX = 150;
      const maxOffsetY = 30;

      this.baseOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, targetX));
      this.baseOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, targetY));

      this.applyPanoramaPosition();
    }, { passive: true });

    overlay.addEventListener('touchend', () => {
      this.isDragging = false;
    }, { passive: true });
  }

  openElement(element: LayerElement) {
    this.selectedElement = element;
    this.stateService.setActiveElementId(element.id);
    
    // Add micro delay for smooth UI transition
    setTimeout(() => {
      this.showModal = true;
    }, 100);
  }

  closeModal() {
    this.showModal = false;
    this.selectedElement = null;
  }

  backToScan() {
    this.showModal = false;
    this.selectedElement = null;
    window.dispatchEvent(new CustomEvent('back-to-scan-request'));
  }
}
