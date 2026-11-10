'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { byNewest, listCol } from '@/lib/db';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

const CFG = {
  populer: { title: 'Produk Populer', icon: '🔥', sub: 'Produk favorit pilihan kami', flag: 'popular' },
  rekomendasi: { title: 'Produk Rekomendasi', icon: '⭐', sub: 'Pilihan terbaik untukmu', flag: 'recommended' },
} as const;

export default function ProductListPage({ kind }: { kind: 'populer' | 'rekomendasi' }) {
  const c = CFG[kind];
  const [items, setItems] = useState<Product[] | null>(null);
  const [fail, setFail] = useState(false);
  const [n, setN] = useState(20);
  useEffect(() => {
    listCol<Product>('products', true).then((l) => setItems(l.filter((p) => p[c.flag]).sort(byNewest))).catch(() => { setFail(true); setItems([]); });
  }, [c.flag]);

  return (
    <>
      <div className="wrap"><div className="plist-head"><span>{c.icon}</span><div><h1>{c.title}</h1><small>{c.sub}{items ? ` · ${items.length} produk` : ''}</small></div></div></div>
      {!items ? <div className="wrap grid sk">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card skel" />)}</div> : (
        <section className="wrap sec">
          {fail && <p className="err">Gagal memuat data. Periksa konfigurasi Firebase.</p>}
          {!items.length && !fail && <div className="center"><p className="muted">Belum ada produk di halaman ini.</p><Link className="btn" href="/">Kembali ke Beranda</Link></div>}
          <div className="grid">{items.slice(0, n).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          {items.length > n && <button className="btn ghost more-all" onClick={() => setN((v) => v + 20)}>Tampilkan lebih banyak</button>}
        </section>
      )}
    </>
  );
}
