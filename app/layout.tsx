import type { Metadata, Viewport } from 'next';
import './globals.css';
import SiteProvider from '@/components/SiteProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tracker from '@/components/Tracker';
import { fetchSettings, siteUrl } from '@/lib/server';
import { DEFAULT_SETTINGS } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const s = await fetchSettings();
  const name = (s?.siteName as string) || DEFAULT_SETTINGS.siteName;
  const desc = (s?.description as string) || DEFAULT_SETTINGS.description;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s | ${name}` },
    description: desc,
    openGraph: { title: name, description: desc, siteName: name, locale: 'id_ID', type: 'website' },
    twitter: { card: 'summary_large_image', title: name, description: desc },
  };
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F4511E' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SiteProvider><Tracker /><Header /><main>{children}</main><Footer /></SiteProvider>
      </body>
    </html>
  );
}
