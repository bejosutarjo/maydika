'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSite } from './SiteProvider';
import Img from './Img';
import { TikTokIcon } from './PlatformIcons';
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from './SocialIcons';

export default function Footer() {
  const { settings: s, categories } = useSite();
  const path = usePathname();
  if (path?.startsWith('/admin')) return null;
  const wa = s.whatsapp.replace(/\D/g, '');
  const socials = [
    { n: 'Instagram', u: s.instagram, i: <InstagramIcon /> },
    { n: 'Facebook', u: s.facebook, i: <FacebookIcon /> },
    { n: 'TikTok', u: s.tiktok, i: <TikTokIcon /> },
    { n: 'YouTube', u: s.youtube, i: <YouTubeIcon /> },
  ].filter((x) => x.u);
  return (
    <footer className="ftr">
      <div className="wrap f-grid">
        <div className="f-brand">
          <div className="f-logo">
            <span className="logo-chip">{s.logo ? <Img src={s.logo} alt="" w={160} sizes="96px" /> : <span className="logo-mark">M</span>}</span>
            <b>{s.siteName}</b>
          </div>
          {s.description && <p className="f-desc">{s.description}</p>}
          <div className="f-safe"><span>🛡️ Transaksi di Shopee &amp; TikTok Shop</span><span>🔗 Link resmi</span></div>
          {(socials.length > 0 || wa) && (
            <div className="soc" aria-label="Media sosial">
              {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>}
              {socials.map((x) => <a key={x.n} href={x.u} target="_blank" rel="noopener noreferrer" aria-label={x.n}>{x.i}</a>)}
            </div>
          )}
        </div>
        <div className="f-col">
          <h4>Jelajahi</h4>
          <Link href="/">Beranda</Link>
          <Link href="/?sec=terbaru">Produk Terbaru</Link>
          <Link href="/?sec=populer">Produk Populer</Link>
          <Link href="/?sec=rekomendasi">Rekomendasi</Link>
          <Link href="/syarat">Syarat &amp; Ketentuan</Link>
        </div>
        {categories.length > 0 && (
          <div className="f-col">
            <h4>Kategori</h4>
            {categories.slice(0, 6).map((c) => <Link key={c.id} href={`/?cat=${c.id}`}>{c.icon} {c.name}</Link>)}
          </div>
        )}
        {wa && <div className="f-brand"><a className="f-wa" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Chat via WhatsApp</a></div>}
      </div>
      <div className="copy"><p>© {new Date().getFullYear()} {s.siteName}. Kami dapat menerima komisi afiliasi dari pembelian melalui tautan Shopee &amp; TikTok Shop.</p></div>
    </footer>
  );
}
