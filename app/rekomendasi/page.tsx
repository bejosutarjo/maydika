import type { Metadata } from 'next';
import ProductListPage from '@/components/ProductListPage';
import { fetchProducts, slim } from '@/lib/server';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Produk Rekomendasi', description: 'Rekomendasi produk terbaik dengan link resmi Shopee dan TikTok Shop.', alternates: { canonical: '/rekomendasi' } };

export default async function Page() {
  const items = (await fetchProducts()).filter((p) => p.recommended).map(slim);
  return <ProductListPage kind="rekomendasi" products={items} />;
}
