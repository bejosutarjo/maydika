'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSite } from './SiteProvider';

const s = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
const TABS = [
  { href: '/', label: 'Beranda', icon: <svg {...s}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg> },
  { href: '/populer', label: 'Populer', icon: <svg {...s}><path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.7-2.6 1.5-3.5C9.5 9 11 7 12 3z" /></svg> },
  { href: '/rekomendasi', label: 'Rekomendasi', icon: <svg {...s}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg> },
];

// Menu bawah ala aplikasi native. Hanya tampil saat dibuka dari aplikasi terpasang (display-mode: standalone, diatur lewat CSS).
export default function AppTabBar() {
  const path = usePathname();
  const { settings } = useSite();
  const [copied, setCopied] = useState(false);
  if (!path || path.startsWith('/admin') || path.startsWith('/produk/') || path === '/install') return null;
  const tap = () => { try { navigator.vibrate?.(8); } catch { /* abaikan */ } };
  async function share() {
    tap();
    const data = { title: settings.siteName, text: 'Rekomendasi produk pilihan, cek diskon langsung di Shopee & TikTok Shop', url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* dibatalkan pengguna */ }
  }
  return (
    <nav className="app-tabs" aria-label="Menu aplikasi">
      {TABS.map((t) => {
        const on = t.href === '/' ? path === '/' : path.startsWith(t.href);
        return <Link key={t.href} href={t.href} onClick={tap} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>{t.icon}<span>{t.label}</span></Link>;
      })}
      <button type="button" onClick={share}>
        <svg {...s}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></svg>
        <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
      </button>
    </nav>
  );
}
