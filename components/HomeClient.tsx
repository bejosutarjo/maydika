'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { byNewest, listCol } from '@/lib/db';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import BannerSlider from './BannerSlider';
import { useSite } from './SiteProvider';

function Section({ title, items }: { title: string; items: Product[] }) {
  if (!items.length) return null;
  return <section className="wrap sec"><h2>{title}</h2><div className="grid">{items.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}</div></section>;
}

export default function HomeClient() {
  const sp = useSearchParams();
  const { categories } = useSite();
  const q = (sp.get('q') || '').toLowerCase();
  const cat = sp.get('cat') || '';
  const [all, setAll] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { listCol<Product>('products', true).then((l) => setAll(l.sort(byNewest))).catch(() => { setFailed(true); setAll([]); }); }, []);

  if (!all) return <div className="wrap grid sk">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card skel" />)}</div>;
  if (q || cat) {
    const r = all.filter((p) => (!cat || p.categoryId === cat) && (!q || p.name.toLowerCase().includes(q)));
    const cn = categories.find((c) => c.id === cat)?.name;
    return <section className="wrap sec"><h2>{q ? `Hasil untuk “${q}”` : cn || 'Kategori'}</h2>
      {r.length ? <div className="grid">{r.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p className="muted">Produk tidak ditemukan.</p>}</section>;
  }
  return (
    <>
      <BannerSlider />
      {failed && <p className="wrap err">Gagal memuat data. Periksa konfigurasi Firebase.</p>}
      {!all.length && !failed && <p className="wrap muted sec">Belum ada produk. Owner dapat menambahkannya lewat /admin.</p>}
      <Section title="Produk Terbaru" items={all} />
      <Section title="Produk Populer" items={all.filter((p) => p.popular)} />
      <Section title="Rekomendasi" items={all.filter((p) => p.recommended)} />
    </>
  );
}
