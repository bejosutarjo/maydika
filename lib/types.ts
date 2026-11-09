export type Product = {
  id: string; name: string; description: string; price: number; promoPrice: number;
  categoryId: string; image: string; affiliateUrl: string; active: boolean;
  popular?: boolean; recommended?: boolean; isDemo?: boolean; createdAt?: { seconds: number };
};
export type Category = { id: string; name: string; icon: string; image: string; isDemo?: boolean };
export type Banner = { id: string; title: string; image: string; link: string; order: number; active: boolean; isDemo?: boolean };
export type Settings = {
  siteName: string; description: string; logo: string; whatsapp: string;
  instagram: string; facebook: string; tiktok: string; youtube: string; terms: string;
};
export const DEFAULT_SETTINGS: Settings = {
  siteName: 'MAYDIKA AFFILIATE',
  description: 'Rekomendasi produk pilihan dengan harga terbaik, langsung ke Shopee.',
  logo: '', whatsapp: '', instagram: '', facebook: '', tiktok: '', youtube: '',
  terms: 'Situs ini adalah media afiliasi. Kami tidak memproses pembayaran. Pembelian dilakukan di Shopee dan tunduk pada ketentuan Shopee. Harga dan ketersediaan dapat berubah sewaktu-waktu. Kami dapat menerima komisi dari pembelian melalui tautan di situs ini.',
};
