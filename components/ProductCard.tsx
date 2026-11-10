import Link from 'next/link';
import Img from './Img';
import { Product } from '@/lib/types';
import { discount } from '@/lib/util';

const n = (v: number) => Math.round(v || 0).toLocaleString('id-ID');

export default function ProductCard({ p }: { p: Product }) {
  const d = discount(p);
  const now = d > 0 ? p.promoPrice : p.price;
  return (
    <article className="card">
      <Link href={`/produk/${p.id}`} className="card-img" aria-label={p.name}>
        <Img src={p.image} alt={p.name} sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, 240px" />
        {d > 0 && <span className="disc"><b>{d}%</b><i>OFF</i></span>}
        {p.isDemo && <span className="dm">DEMO</span>}
      </Link>
      <div className="card-body">
        <Link href={`/produk/${p.id}`} className="card-name">{p.name}</Link>
        {(p.popular || p.recommended) && (
          <div className="chips">{p.popular && <span>Populer</span>}{p.recommended && <span>Pilihan</span>}</div>
        )}
        <div className="price">
          <b><small>Rp</small>{n(now)}</b>
          {d > 0 && <s>Rp{n(p.price)}</s>}
        </div>
        <a className="btn-s" href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">BELI SEKARANG</a>
      </div>
    </article>
  );
}
