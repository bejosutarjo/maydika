'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

const CFG = {
  populer: { title: 'Produk Populer', icon: '🔥', sub: 'Produk favorit pilihan kami' },
  rekomendasi: { title: 'Produk Rekomendasi', icon: '⭐', sub: 'Pilihan terbaik untukmu' },
} as const;

export default function ProductListPage({ kind, products }: { kind: 'populer' | 'rekomendasi'; products: Product[] }) {
  const c = CFG[kind];
  const [n, setN] = useState(20);
  return (
    <>
      <div className="wrap"><div className="plist-head"><span>{c.icon}</span><div><h1>{c.title}</h1><small>{c.sub} · {products.length} produk</small></div></div></div>
      <section className="wrap sec">
        {!products.length && <div className="center"><p className="muted">Belum ada produk di halaman ini.</p><Link className="btn" href="/">Kembali ke Beranda</Link></div>}
        <div className="grid">{products.slice(0, n).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        {products.length > n && <button className="btn ghost more-all" onClick={() => setN((v) => v + 20)}>Tampilkan lebih banyak</button>}
      </section>
    </>
  );
}
