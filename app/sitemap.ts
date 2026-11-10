import type { MetadataRoute } from 'next';
import { fetchActiveProducts } from '@/lib/server';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const products = await fetchActiveProducts();
  return [{ url: base, changeFrequency: 'daily', priority: 1 }, { url: `${base}/populer`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/rekomendasi`, changeFrequency: 'daily', priority: 0.8 }, { url: `${base}/syarat`, priority: 0.2 },
    ...products.map((p) => ({ url: `${base}/produk/${p.id}`, changeFrequency: 'weekly' as const, priority: 0.7 }))];
}
