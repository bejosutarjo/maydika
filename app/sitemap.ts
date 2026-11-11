import type { MetadataRoute } from 'next';
import { fetchActiveProducts, siteUrl } from '@/lib/server';

// Tersedia di /sitemap.xml. Selalu mengembalikan XML valid, walau Firestore gagal dibaca.
export const revalidate = 3600;

const safeDate = (v: unknown, fallback: Date) => {
  const d = v ? new Date(String(v)) : fallback;
  return Number.isNaN(d.getTime()) ? fallback : d;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/populer`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/rekomendasi`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/syarat`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
  try {
    const products = await fetchActiveProducts();
    return [...pages, ...products.map((p) => ({
      url: `${base}/produk/${p.id}`,
      lastModified: safeDate(p._updated, now),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))];
  } catch {
    return pages;
  }
}
