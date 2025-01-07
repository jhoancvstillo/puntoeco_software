// src/types/leaflet.fullscreen.d.ts

declare module 'leaflet.fullscreen' {
  import * as L from 'leaflet';

  interface FullscreenOptions {
    position?: L.ControlPosition;
    title?: string;
    titleCancel?: string;
    forceSeparateButton?: boolean;
    forcePseudoFullscreen?: boolean;
    fullscreenElement?: boolean;
  }

  namespace control {
    function fullscreen(options?: FullscreenOptions): L.Control;
  }

  // Extender la interfaz de Map para permitir fullscreenControl
  interface FullscreenMapOptions extends L.MapOptions {
    fullscreenControl?: boolean;
  }
}
