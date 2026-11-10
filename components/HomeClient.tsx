'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { byNewest, listCol } from '@/lib/db';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import BannerSlider from './BannerSlider';
import Img from './Img';
import { useSite } from './SiteProvider';

const TITLES: Record<string, string> = { terbaru: 'Produk Terbaru', populer: 'Produk Populer', rekomendasi: 'Produk Rekomendasi' };

export default function HomeClient() {
  const sp = useSearchParams();
  const { categories } = useSite();
  const q = (sp.get('q') || '').toLowerCase();
  const cat = sp.get('cat') || '';
  const sec = sp.get('sec') || '';
  const [all, setAll] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    listCol<Product>('products', true).then((l) => setAll(l.sort(byNewest))).catch(() => { setFailed(true); setAll([]); });
  }, []);

  if (!all) return <div className="wrap grid sk">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card skel" />)}</div>;
  const pick = (k: string) => (k === 'populer' ? all.filter((p) => p.popular) : k === 'rekomendasi' ? all.filter((p) => p.recommended) : all);

  if (q || cat || TITLES[sec]) {
    const base = TITLES[sec] && !q && !cat ? pick(sec) : all;
    const r = base.filter((p) => (!cat || p.categoryId === cat) && (!q || p.name.toLowerCase().includes(q)));
    const title = q ? `Hasil untuk “${q}”` : cat ? categories.find((c) => c.id === cat)?.name || 'Kategori' : TITLES[sec];
    return (
      <section className="wrap sec"><h2>{title}</h2>
        {r.length ? <div className="grid">{r.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p className="muted">Produk tidak ditemukan.</p>}
      </section>
    );
  }
  const Section = ({ k }: { k: string }) => {
    const items = pick(k);
    if (!items.length) return null;
    return (
      <section className="wrap sec">
        <div className="row"><h2>{TITLES[k]}</h2>{items.length > 8 && <Link href={`/?sec=${k}`} className="more">Lihat semua →</Link>}</div>
        <div className="grid">{items.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    );
  };
  return (
    <>
      <BannerSlider />
      <div className="wrap quick">
        <Link href="/populer" className="q"><span>🔥</span><div><b>Produk Populer</b><small>Produk favorit</small></div></Link>
        <Link href="/rekomendasi" className="q q2"><span>⭐</span><div><b>Rekomendasi</b><small>Pilihan terbaik kami</small></div></Link>
      </div>
      {categories.length > 0 && (
        <section className="wrap sec"><h2>Kategori</h2>
          <div className="catgrid">
            {categories.map((c) => (
              <Link key={c.id} href={`/?cat=${c.id}`} className="cat">
                {c.image ? <Img src={c.image} alt="" w={160} sizes="64px" /> : <span className="ico">{c.icon || '🛍️'}</span>}
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {failed && <p className="wrap err">Gagal memuat data. Periksa konfigurasi Firebase dan Firestore Rules.</p>}
      {!all.length && !failed && <p className="wrap muted sec">Belum ada produk. Owner dapat menambahkannya lewat /admin.</p>}
      <Section k="terbaru" />
    </>
  );
}
