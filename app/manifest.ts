import type { MetadataRoute } from 'next';

// Manifest PWA situs publik (dashboard admin punya manifest sendiri di /admin-manifest.webmanifest).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'MAYDIKA AFFILIATE',
    short_name: 'MAYDIKA',
    description: 'Rekomendasi produk pilihan, langsung ke Shopee dan TikTok Shop.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'id',
    background_color: '#ffffff',
    theme_color: '#C43A09',
    icons: [
      { src: '/icons/app-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/app-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/app-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Produk Populer', url: '/populer' },
      { name: 'Rekomendasi', url: '/rekomendasi' },
    ],
  };
}
