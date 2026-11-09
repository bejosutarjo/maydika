'use client';
import Link from 'next/link';
import { useSite } from './SiteProvider';

export default function Footer() {
  const { settings: s } = useSite();
  const wa = s.whatsapp.replace(/\D/g, '');
  const socials = [['Instagram', s.instagram], ['Facebook', s.facebook], ['TikTok', s.tiktok], ['YouTube', s.youtube]].filter(([, u]) => u);
  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <div><b>{s.siteName}</b><p>{s.description}</p></div>
        <div>
          <b>Tautan</b>
          <Link href="/">Beranda</Link>
          <Link href="/syarat">Syarat &amp; Ketentuan</Link>
        </div>
        <div>
          <b>Kontak</b>
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          {socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}
        </div>
      </div>
      <p className="wrap copy">© {new Date().getFullYear()} {s.siteName}. Kami dapat menerima komisi afiliasi dari pembelian melalui tautan Shopee.</p>
    </footer>
  );
}
