'use client';
import Link from 'next/link';
import Img from './Img';
import { Product } from '@/lib/types';
import { discount, formatCount } from '@/lib/util';
import { ShopeeIcon, TikTokIcon } from './PlatformIcons';
import { trackClick } from '@/lib/track';

const n = (v: number) => Math.round(v || 0).toLocaleString('id-ID');

export default function ProductCard({ p }: { p: Product }) {
  const d = discount(p);
  const now = d > 0 ? p.promoPrice : p.price;
  const both = !!(p.affiliateUrl && p.tiktokUrl);
  const rel = 'noopener noreferrer sponsored';
  return (
    <article className="card">
      <Link href={`/produk/${p.id}`} className="card-img" aria-label={p.name}>
        <Img src={p.image} alt={p.name} sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, 240px" />
        {d > 0 && <span className="disc"><b>{d}%</b><i>OFF</i></span>}
        {p.isDemo && <span className="dm">DEMO</span>}
      </Link>
      <div className="card-body">
        <Link href={`/produk/${p.id}`} className="card-name">{p.isMall && <span className="mall">Mall</span>}{p.name}</Link>
        {(p.popular || p.recommended) && <div className="chips">{p.popular && <span>Populer</span>}{p.recommended && <span>Pilihan</span>}</div>}
        {((p.rating || 0) > 0 || (p.sold || 0) > 0) && (
          <div className="meta">
            {(p.rating || 0) > 0 && <span className="rt">★ {(p.rating || 0).toFixed(1)}</span>}
            {(p.sold || 0) > 0 && <span>{formatCount(p.sold || 0)} terjual</span>}
          </div>
        )}
        <div className="price">
          <b><small>Rp</small>{n(now)}</b>
          {d > 0 && <s>Rp{n(p.price)}</s>}
        </div>
        <div className="btns">
          {p.affiliateUrl && <a className="btn-s shp" onClick={() => trackClick(p.id, 'shopee')} href={p.affiliateUrl} target="_blank" rel={rel}><ShopeeIcon />{both ? 'Shopee' : 'Beli Sekarang'}</a>}
          {p.tiktokUrl && <a className="btn-s tt" onClick={() => trackClick(p.id, 'tiktok')} href={p.tiktokUrl} target="_blank" rel={rel}><TikTokIcon />{both ? 'TikTok' : 'Beli Sekarang'}</a>}
        </div>
      </div>
    </article>
  );
}
