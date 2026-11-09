import type { Metadata } from 'next';
import ProductView from '@/components/ProductView';
import { fetchProduct } from '@/lib/server';
import { optimize } from '@/lib/util';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await fetchProduct(id);

  if (!p) return { title: 'Produk' };

  const desc = String(p.description || '').slice(0, 160);
  const img = p.image && !String(p.image).startsWith('data:')
    ? [optimize(p.image, 1200)]
    : undefined;

  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/produk/${id}` },
    openGraph: {
      title: p.name,
      description: desc,
      images: img,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ProductView id={id} />;
}
