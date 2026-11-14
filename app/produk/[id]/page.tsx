import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';
import { fetchProduct, fetchProducts, slim } from '@/lib/server';
import { optimize } from '@/lib/util';
import type { Product } from '@/lib/types';

export const revalidate = 60;
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await fetchProduct(id);
  if (!p) return { title: 'Produk' };
  const desc = String(p.description || '').slice(0, 160);
  const img = p.image && !String(p.image).startsWith('data:') ? [optimize(p.image, 1200)] : undefined;
  return { title: p.name, description: desc, alternates: { canonical: `/produk/${id}` }, openGraph: { title: p.name, description: desc, images: img, type: 'website' } };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [product, all] = await Promise.all([fetchProduct(id), fetchProducts()]);
  if (!product) notFound();
  // Kumpulan kecil untuk rekomendasi acak di browser (Rekomendasi diutamakan).
  const others = all.filter((p) => p.id !== id);
  const pool = [...others.filter((p) => p.recommended), ...others.filter((p) => !p.recommended)].slice(0, 40).map(slim);
  return <ProductView key={id} product={product as unknown as Product} pool={pool} />;
}
