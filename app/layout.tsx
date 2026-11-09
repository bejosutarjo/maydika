import type { Metadata, Viewport } from 'next';
import './globals.css';
import SiteProvider from '@/components/SiteProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const desc = 'Rekomendasi produk pilihan dengan harga terbaik, langsung ke Shopee.';
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'MAYDIKA AFFILIATE', template: '%s | MAYDIKA AFFILIATE' },
  description: desc,
  openGraph: { title: 'MAYDIKA AFFILIATE', description: desc, siteName: 'MAYDIKA AFFILIATE', locale: 'id_ID', type: 'website' },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F4511E' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SiteProvider><Header /><main>{children}</main><Footer /></SiteProvider>
      </body>
    </html>
  );
}
