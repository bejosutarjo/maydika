'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSite } from './SiteProvider';
import { TikTokIcon } from './PlatformIcons';
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from './SocialIcons';

export default function Footer() {
  const { settings: s } = useSite();
  const path = usePathname();
  if (path?.startsWith('/admin') || path?.startsWith('/produk/')) return null;
  const wa = s.whatsapp.replace(/\D/g, '');
  const socials = [
    { n: 'WhatsApp', u: wa ? `https://wa.me/${wa}` : '', i: <WhatsAppIcon /> },
    { n: 'Instagram', u: s.instagram, i: <InstagramIcon /> },
    { n: 'Facebook', u: s.facebook, i: <FacebookIcon /> },
    { n: 'TikTok', u: s.tiktok, i: <TikTokIcon /> },
    { n: 'YouTube', u: s.youtube, i: <YouTubeIcon /> },
  ].filter((x) => x.u);
  return (
    <footer className="ftr">
      <div className="wrap f-simple">
        <nav className="f-links" aria-label="Footer">
          <Link href="/">Beranda</Link>
          <Link href="/populer">Populer</Link>
          <Link href="/rekomendasi">Rekomendasi</Link>
          <Link href="/syarat">Syarat &amp; Ketentuan</Link>
        </nav>
        {socials.length > 0 && (
          <div className="soc" aria-label="Media sosial">
            {socials.map((x) => <a key={x.n} href={x.u} target="_blank" rel="noopener noreferrer" aria-label={x.n}>{x.i}</a>)}
          </div>
        )}
        {s.description && <p className="f-desc">{s.description}</p>}
      </div>
      <div className="copy"><p>© {new Date().getFullYear()} {s.siteName}</p></div>
    </footer>
  );
}
