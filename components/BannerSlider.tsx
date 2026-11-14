'use client';
import { useEffect, useState } from 'react';
import { Banner } from '@/lib/types';
import Img from './Img';

export default function BannerSlider({ banners }: { banners: Banner[] }) {
  const len = banners.length;
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]); // hanya banner aktif & berikutnya yang gambarnya dimuat
  useEffect(() => {
    if (len < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % len), 5000);
    return () => clearInterval(t);
  }, [len]);
  useEffect(() => { if (len) setSeen((s) => Array.from(new Set([...s, i, (i + 1) % len]))); }, [i, len]);
  if (!len) return <div className="wrap"><div className="hero">Promo pilihan, langsung ke Shopee</div></div>;
  return (
    <div className="wrap">
      <div className="slider">
        {banners.map((b, n) => {
          const img = seen.includes(n)
            ? <Img src={b.image} alt={b.title || 'Banner'} w={1024} sizes="(max-width:1200px) 100vw, 1200px" loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : undefined} />
            : null;
          return (
            <div key={b.id} className={'slide' + (n === i ? ' on' : '')} aria-hidden={n !== i}>
              {img && (b.link ? <a href={b.link} tabIndex={n === i ? 0 : -1} target="_blank" rel="noopener noreferrer sponsored">{img}</a> : img)}
            </div>
          );
        })}
        {len > 1 && <div className="dots">{banners.map((b, n) => <button key={b.id} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Banner ${n + 1}`} />)}</div>}
      </div>
    </div>
  );
}
