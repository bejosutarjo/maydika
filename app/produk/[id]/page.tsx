import type { Metadata } from 'next';
import ProductView from '@/components/ProductView';
import { fetchProduct } from '@/lib/server';
import { optimize } from '@/lib/util';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await fetchProduct(params.id);
  if (!p) return { title: 'Produk' };
  const desc = String(p.description || '').slice(0, 160);
  const img = p.image && !String(p.image).startsWith('data:') ? [optimize(p.image, 1200)] : undefined;
  return { title: p.name, description: desc, alternates: { canonical: `/produk/${params.id}` }, openGraph: { title: p.name, description: desc, images: img, type: 'website' } };
}
export default function Page({ params }: { params: { id: string } }) { return <ProductView id={params.id} />; }
