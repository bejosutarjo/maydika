import type { Metadata } from 'next';
import InstallPage from '@/components/InstallPage';

export const metadata: Metadata = {
  title: 'Pasang Aplikasi',
  description: 'Pasang MAYDIKA AFFILIATE di layar utama HP kamu agar akses produk pilihan lebih cepat.',
  alternates: { canonical: '/install' },
};

export default function Page() { return <InstallPage />; }
