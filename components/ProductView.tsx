'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getItem } from '@/lib/db';
import { Product } from '@/lib/types';
import { discount, rupiah } from '@/lib/util';
import Img from './Img';
import { useSite } from './SiteProvider';

export default function ProductView({ id }: { id: string }) {
  const [p, setP] = useState<Product | null | undefined>();
  const { categories } = useSite();
  useEffect(() => { getItem<Product>('products', id).then(setP); }, [id]);
  if (p === undefined) return <div className="wrap"><div className="spin" /></div>;
  if (!p) return <div className="wrap center"><h1>Produk tidak ditemukan</h1><Link className="btn" href="/">Kembali ke Beranda</Link></div>;
  const d = discount(p);
  const cat = categories.find((c) => c.id === p.categoryId);
  return (
    <div className="wrap detail">
      <div className="d-img"><Img src={p.image} alt={p.name} w={1024} sizes="(max-width:800px) 100vw, 520px" loading="eager" />{p.isDemo && <span className="badge demo">DEMO</span>}</div>
      <div>
        {cat && <Link href={`/?cat=${cat.id}`} className="tag">{cat.icon} {cat.name}</Link>}
        <h1>{p.name}</h1>
        <div className="price big"><b>{rupiah(d > 0 ? p.promoPrice : p.price)}</b>{d > 0 && <><s>{rupiah(p.price)}</s><span className="badge in">-{d}%</span></>}</div>
        <a className="btn lg" href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">BELI DI SHOPEE</a>
        <small className="muted">Anda akan diarahkan ke Shopee. Harga dapat berubah di Shopee.</small>
        <h3>Deskripsi</h3>
        <p className="desc">{p.description || 'Tidak ada deskripsi.'}</p>
      </div>
    </div>
  );
}
