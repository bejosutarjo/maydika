import type { MetadataRoute } from 'next';

// Manifest PWA situs publik (dashboard admin punya manifest sendiri di /admin-manifest.webmanifest).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'MAYDIKA AFFILIATE',
    short_name: 'MAYDIKA',
    description: 'Rekomendasi produk pilihan dengan link resmi Shopee dan TikTok Shop. Cek diskon langsung dari aplikasi.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait',
    lang: 'id',
    dir: 'ltr',
    categories: ['shopping', 'lifestyle'],
    background_color: '#C43A09',
    theme_color: '#C43A09',
    prefer_related_applications: false,
    icons: [
      { src: '/icons/app-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/app-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/app-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [
      { src: '/screenshots/app-1.jpg', sizes: '1080x1920', type: 'image/jpeg', form_factor: 'narrow', label: 'Rekomendasi produk pilihan' },
      { src: '/screenshots/app-2.jpg', sizes: '1080x1920', type: 'image/jpeg', form_factor: 'narrow', label: 'Populer, rekomendasi, dan cek diskon' },
    ],
    shortcuts: [
      { name: 'Produk Populer', short_name: 'Populer', url: '/populer', icons: [{ src: '/icons/app-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'Rekomendasi', short_name: 'Rekomendasi', url: '/rekomendasi', icons: [{ src: '/icons/app-192.png', sizes: '192x192', type: 'image/png' }] },
    ],
  };
}
