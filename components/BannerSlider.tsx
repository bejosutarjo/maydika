'use client';
import { useEffect, useState } from 'react';
import { listCol } from '@/lib/db';
import { Banner } from '@/lib/types';
import Img from './Img';

export default function BannerSlider() {
  const [items, setItems] = useState<Banner[]>([]);
  const [i, setI] = useState(0);
  useEffect(() => { listCol<Banner>('banners', true).then((b) => setItems(b.sort((x, y) => x.order - y.order))).catch(() => {}); }, []);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  if (!items.length) return <div className="wrap"><div className="hero">Promo pilihan, langsung ke Shopee</div></div>;
  return (
    <div className="wrap">
      <div className="slider">
        {items.map((b, n) => {
          const img = <Img src={b.image} alt={b.title || 'Banner'} w={1600} sizes="(max-width:1200px) 100vw, 1200px" loading={n === 0 ? 'eager' : 'lazy'} />;
          return (
            <div key={b.id} className={'slide' + (n === i ? ' on' : '')} aria-hidden={n !== i}>
              {b.link ? <a href={b.link} target="_blank" rel="noopener noreferrer sponsored">{img}</a> : img}
            </div>
          );
        })}
        {items.length > 1 && <div className="dots">{items.map((b, n) => <button key={b.id} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Banner ${n + 1}`} />)}</div>}
      </div>
    </div>
  );
}
