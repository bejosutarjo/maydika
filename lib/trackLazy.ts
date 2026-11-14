import { shouldSkip } from './skip';

// Modul pelacakan (berisi Firebase SDK) baru dimuat setelah halaman selesai tampil.
const later = (f: () => void, ms = 3000) => { setTimeout(f, ms); };
export const lazyTrack = {
  page: () => later(() => { if (!shouldSkip()) import('./track').then((m) => m.trackPageView()).catch(() => {}); }),
  view: (id: string) => later(() => { if (!shouldSkip()) import('./track').then((m) => m.trackProductView(id)).catch(() => {}); }),
  click: (id: string, k: 'shopee' | 'tiktok') => { if (!shouldSkip()) import('./track').then((m) => m.trackClick(id, k)).catch(() => {}); },
};
