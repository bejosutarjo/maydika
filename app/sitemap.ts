import type { MetadataRoute } from 'next';
import { fetchActiveProducts, siteUrl } from '@/lib/server';

// Tersedia di /sitemap.xml (dibuat otomatis dari produk aktif di Firestore).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const products = await fetchActiveProducts();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/populer`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/rekomendasi`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/syarat`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ...products.map((p) => ({
      url: `${base}/produk/${p.id}`,
      lastModified: p._updated ? new Date(p._updated) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
