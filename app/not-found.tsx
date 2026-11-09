import Link from 'next/link';
export default function NotFound() {
  return <div className="wrap center"><h1 className="n404">404</h1><p>Halaman tidak ditemukan.</p><Link className="btn" href="/">Kembali ke Beranda</Link></div>;
}
