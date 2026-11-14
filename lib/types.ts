export type Product = {
  id: string; name: string; description: string; price: number; promoPrice: number;
  categoryId: string; image: string; images?: string[]; affiliateUrl: string; tiktokUrl?: string; active: boolean;
  popular?: boolean; recommended?: boolean; isDemo?: boolean; createdAt?: { seconds: number };
  storeName?: string; isMall?: boolean; rating?: number; ratingCount?: number; sold?: number; reviews?: string;
};
export type Category = { id: string; name: string; icon: string; image: string; isDemo?: boolean };
export type Banner = { id: string; title: string; image: string; link: string; order: number; active: boolean; isDemo?: boolean };
export type Settings = {
  siteName: string; description: string; logo: string; whatsapp: string;
  instagram: string; facebook: string; tiktok: string; youtube: string; terms: string;
  detail: string; // 'on' = halaman detail produk aktif, 'off' = kartu langsung membuka Shopee/TikTok
};
export const DEFAULT_SETTINGS: Settings = {
  siteName: 'MAYDIKA AFFILIATE',
  description: 'Rekomendasi produk pilihan dengan harga terbaik, langsung ke Shopee dan TikTok Shop.',
  detail: 'off', logo: '', whatsapp: '', instagram: '', facebook: '', tiktok: '', youtube: '',
  terms: 'Situs ini adalah media afiliasi. Kami tidak memproses pembayaran. Pembelian dilakukan di Shopee atau TikTok Shop dan tunduk pada ketentuan masing-masing platform. Harga dan ketersediaan dapat berubah sewaktu-waktu. Kami dapat menerima komisi dari pembelian melalui tautan di situs ini.',
};
