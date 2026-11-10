import type { Metadata } from 'next';
import ProductListPage from '@/components/ProductListPage';
export const metadata: Metadata = { title: 'Produk Populer', description: 'Produk populer pilihan dengan link resmi Shopee dan TikTok Shop.', alternates: { canonical: '/populer' } };
export default function Page() { return <ProductListPage kind="populer" />; }
