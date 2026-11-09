import Link from 'next/link';
import Img from './Img';
import { Product } from '@/lib/types';
import { discount, rupiah } from '@/lib/util';

export default function ProductCard({ p }: { p: Product }) {
  const d = discount(p);
  return (
    <article className="card">
      <Link href={`/produk/${p.id}`} className="card-img">
        <Img src={p.image} alt={p.name} />
        {d > 0 && <span className="badge">-{d}%</span>}
        {p.isDemo && <span className="badge demo">DEMO</span>}
      </Link>
      <div className="card-body">
        <Link href={`/produk/${p.id}`} className="card-name">{p.name}</Link>
        <div className="price">
          <b>{rupiah(d > 0 ? p.promoPrice : p.price)}</b>
          {d > 0 && <s>{rupiah(p.price)}</s>}
        </div>
        <a className="btn" href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">BELI SEKARANG</a>
      </div>
    </article>
  );
}
