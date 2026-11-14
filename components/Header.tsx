'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSite } from './SiteProvider';
import Img from './Img';

export default function Header() {
  const { settings, categories } = useSite();
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState('');
  if (path?.startsWith('/admin')) return null;
  const isProduct = !!path?.startsWith('/produk/');
  const goBack = () => { if (window.history.length > 1) router.back(); else router.push('/'); };
  return (
    <header className={'hdr' + (isProduct ? ' hdr-prod' : '')}>
      <div className="wrap hdr-in">
        {isProduct && (
          <button type="button" className="hdr-back" onClick={goBack} aria-label="Kembali">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
        )}
        <Link href="/" className="logo" aria-label={settings.siteName}>
          <span className="logo-chip">
            {settings.logo ? <Img src={settings.logo} alt="" w={160} sizes="96px" loading="eager" /> : <span className="logo-mark">M</span>}
          </span>
          <span className="logo-txt"><b>{settings.siteName}</b><small>Rekomendasi produk pilihan</small></span>
        </Link>
        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/'); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk impianmu…" maxLength={80} aria-label="Cari produk" />
          <button type="submit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            Cari
          </button>
        </form>
      </div>
      <nav className="wrap cats" aria-label="Kategori">
        <Link href="/">Semua</Link>
        <Link href="/populer">🔥 Populer</Link>
        <Link href="/rekomendasi">⭐ Rekomendasi</Link>
        {categories.map((c) => <Link key={c.id} href={`/?cat=${c.id}`}>{c.icon} {c.name}</Link>)}
      </nav>
    </header>
  );
}
