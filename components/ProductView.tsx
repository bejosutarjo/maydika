'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getItem, listCol } from '@/lib/db';
import { Product } from '@/lib/types';
import { discount, rupiah } from '@/lib/util';
import Img from './Img';
import ProductCard from './ProductCard';
import { useSite } from './SiteProvider';

export default function ProductView({ id }: { id: string }) {
  const [p, setP] = useState<Product | null | undefined>();
  const [rel, setRel] = useState<Product[]>([]);
  const { categories } = useSite();
  useEffect(() => {
    getItem<Product>('products', id).then((prod) => {
      setP(prod);
      if (prod) listCol<Product>('products', true)
        .then((l) => setRel(l.filter((x) => x.id !== prod.id && prod.categoryId && x.categoryId === prod.categoryId).slice(0, 6))).catch(() => {});
    });
  }, [id]);
  if (p === undefined) return <div className="wrap"><div className="spin" /></div>;
  if (!p) return <div className="wrap center"><h1>Produk tidak ditemukan</h1><Link className="btn" href="/">Kembali ke Beranda</Link></div>;

  const d = discount(p);
  const now = d > 0 ? p.promoPrice : p.price;
  const cat = categories.find((c) => c.id === p.categoryId);
  const buy = { href: p.affiliateUrl, target: '_blank', rel: 'noopener noreferrer sponsored' };

  return (
    <div className="dp">
      <div className="wrap crumb">
        <Link href="/">Beranda</Link>{cat && <> › <Link href={`/?cat=${cat.id}`}>{cat.name}</Link></>} › <span>{p.name}</span>
      </div>
      <div className="wrap detail">
        <div className="d-img">
          <Img src={p.image} alt={p.name} w={1024} sizes="(max-width:800px) 100vw, 480px" loading="eager" />
          {d > 0 && <span className="disc big"><b>{d}%</b><i>OFF</i></span>}
          {p.isDemo && <span className="dm">DEMO</span>}
        </div>
        <div className="d-info">
          <div className="pbar">
            <div className="pnow">{rupiah(now)}</div>
            {d > 0 && <><s>{rupiah(p.price)}</s><span className="pdisc">-{d}%</span></>}
          </div>
          <div className="box">
            {cat && <Link href={`/?cat=${cat.id}`} className="tag">{cat.icon} {cat.name}</Link>}
            <h1 className="d-title">{p.name}</h1>
            <ul className="trust">
              <li>🛡️ Pembayaran &amp; pengiriman diproses langsung oleh Shopee</li>
              <li>🔗 Link resmi menuju halaman produk Shopee</li>
            </ul>
            <a className="btn-buy inline" {...buy}>BELI DI SHOPEE</a>
          </div>
          <div className="box">
            <h3>Deskripsi Produk</h3>
            <p className="desc">{p.description || 'Tidak ada deskripsi.'}</p>
          </div>
        </div>
      </div>
      {rel.length > 0 && <section className="wrap sec"><h2>Produk Terkait</h2><div className="grid">{rel.map((x) => <ProductCard key={x.id} p={x} />)}</div></section>}
      <div className="buybar">
        <div><small>Harga</small><b>{rupiah(now)}</b></div>
        <a className="btn-buy" {...buy}>BELI DI SHOPEE</a>
      </div>
    </div>
  );
}
