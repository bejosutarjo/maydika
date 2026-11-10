import type { Metadata } from 'next';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = {
  title: 'Admin',
  manifest: '/admin-manifest.webmanifest',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'MAYDIKA Admin', statusBarStyle: 'default' },
  icons: { apple: '/icons/admin-180.png' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
