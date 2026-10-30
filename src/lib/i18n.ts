/** Interface strings. Each chapter page uses the language of its deliverable. */
export type Lang = 'es' | 'en';

export const ui = {
  es: {
    resources: 'Recursos',
    open: 'Abrir',
    download: 'Descargar',
    close: 'Cerrar',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    zoomHelp: 'Rueda o +/− para acercar · doble clic · arrastrar para desplazar · Esc para cerrar',
    nextChapter: 'Siguiente capítulo',
    backHome: 'Volver al inicio',
    pending: 'Pendiente',
    viewerLabel: 'Visor de documento',
    loadError: 'No se pudo cargar el archivo.',
  },
  en: {
    resources: 'Resources',
    open: 'Open',
    download: 'Download',
    close: 'Close',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomHelp: 'Wheel or +/− to zoom · double-click · drag to pan · Esc to close',
    nextChapter: 'Next chapter',
    backHome: 'Back to Home',
    pending: 'Pending',
    viewerLabel: 'Document viewer',
    loadError: 'The file could not be loaded.',
  },
} as const;
