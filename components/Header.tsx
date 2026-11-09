'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSite } from './SiteProvider';
import Img from './Img';

export default function Header() {
  const { settings, categories } = useSite();
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="logo" aria-label={settings.siteName}>
          {settings.logo ? <Img src={settings.logo} alt="" w={120} sizes="40px" loading="eager" /> : <span className="logo-mark">M</span>}
          <b>{settings.siteName}</b>
        </Link>
        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/'); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk…" maxLength={80} aria-label="Cari produk" />
          <button type="submit">Cari</button>
        </form>
      </div>
      <nav className="wrap cats" aria-label="Kategori">
        <Link href="/">Semua</Link>
        {categories.map((c) => <Link key={c.id} href={`/?cat=${c.id}`}>{c.icon} {c.name}</Link>)}
      </nav>
    </header>
  );
}
