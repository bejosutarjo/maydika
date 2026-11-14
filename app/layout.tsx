import type { Metadata, Viewport } from 'next';
import './globals.css';
import { preconnect } from 'react-dom';
import SiteProvider from '@/components/SiteProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tracker from '@/components/Tracker';
import { fetchCategories, fetchSettings, siteUrl, slimCategory, slimSettings } from '@/lib/server';
import { DEFAULT_SETTINGS } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const s = await fetchSettings();
  const name = (s?.siteName as string) || DEFAULT_SETTINGS.siteName;
  const desc = (s?.description as string) || DEFAULT_SETTINGS.description;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${name} – Rekomendasi Produk Shopee & TikTok Shop`, template: `%s | ${name}` },
    description: desc,
    openGraph: { title: name, description: desc, siteName: name, locale: 'id_ID', type: 'website', url: '/', images: [{ url: '/og-banner.jpg', width: 1200, height: 630, alt: name }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    twitter: { card: 'summary_large_image', title: name, description: desc, images: ['/og-banner.jpg'] },
  };
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F4511E' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  preconnect('https://res.cloudinary.com'); // gambar Cloudinary mulai tersambung lebih awal
  const [s, cats] = await Promise.all([fetchSettings(), fetchCategories()]);
  // Data terstruktur agar Google mengenali nama situs, logo, dan gambar utama.
  const base = siteUrl();
  const siteName = (s?.siteName as string) || DEFAULT_SETTINGS.siteName;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${base}/#website`, url: `${base}/`, name: siteName, alternateName: ['Maydika', 'Maydika Affiliate'], inLanguage: 'id-ID', description: (s?.description as string) || DEFAULT_SETTINGS.description, publisher: { '@id': `${base}/#org` } },
      { '@type': 'Organization', '@id': `${base}/#org`, name: siteName, url: `${base}/`, logo: { '@type': 'ImageObject', url: `${base}/logo.png`, width: 512, height: 512 }, image: `${base}/og-banner.jpg`,
        sameAs: [s?.instagram, s?.facebook, s?.tiktok, s?.youtube].filter((x) => typeof x === 'string' && x) },
    ],
  };
  return (
    <html lang="id">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
        <SiteProvider initialSettings={slimSettings(s)} initialCategories={cats.map(slimCategory)}>
          <Tracker /><Header /><main>{children}</main><Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
