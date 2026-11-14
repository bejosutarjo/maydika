import type { Metadata } from 'next';
import ProductListPage from '@/components/ProductListPage';
import { fetchProducts, slim } from '@/lib/server';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Produk Populer', description: 'Produk populer pilihan dengan link resmi Shopee dan TikTok Shop.', alternates: { canonical: '/populer' } };

export default async function Page() {
  const items = (await fetchProducts()).filter((p) => p.popular).map(slim);
  return <ProductListPage kind="populer" products={items} />;
}
