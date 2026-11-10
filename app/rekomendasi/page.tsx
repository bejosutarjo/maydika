import type { Metadata } from 'next';
import ProductListPage from '@/components/ProductListPage';
export const metadata: Metadata = { title: 'Produk Rekomendasi', description: 'Rekomendasi produk terbaik dengan link resmi Shopee dan TikTok Shop.', alternates: { canonical: '/rekomendasi' } };
export default function Page() { return <ProductListPage kind="rekomendasi" />; }
