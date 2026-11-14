'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Banner, Product } from '@/lib/types';
import ProductCard from './ProductCard';
import BannerSlider from './BannerSlider';
import CategoryStrip from './CategoryStrip';
import { useSite } from './SiteProvider';

const TITLES: Record<string, string> = { terbaru: 'Produk Terbaru', populer: 'Produk Populer', rekomendasi: 'Produk Rekomendasi' };
type Props = { products: Product[]; banners: Banner[] };

const pick = (all: Product[], k: string) => (k === 'populer' ? all.filter((p) => p.popular) : k === 'rekomendasi' ? all.filter((p) => p.recommended) : all);
const Grid = ({ items }: { items: Product[] }) => <div className="grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>;

// Tampilan beranda bawaan: sudah berisi data dari server (tidak perlu menunggu JavaScript).
function Home({ products, banners }: Props) {
  const populer = pick(products, 'populer');
  return (
    <>
      <BannerSlider banners={banners} />
      <div className="wrap quick">
        <Link href="/populer" className="q"><span>🔥</span><div><b>Produk Populer</b><small>Produk favorit</small></div></Link>
        <Link href="/rekomendasi" className="q q2"><span>⭐</span><div><b>Rekomendasi</b><small>Pilihan terbaik kami</small></div></Link>
      </div>
      {populer.length > 0 && (
        <section className="wrap sec">
          <div className="pop-box">
            <div className="row"><h2>🔥 Produk Populer</h2><Link href="/populer" className="more">Lihat semua →</Link></div>
            <div className="hscroll">{populer.slice(0, 12).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}
      <CategoryStrip />
      {!products.length && <p className="wrap muted sec">Belum ada produk. Owner dapat menambahkannya lewat /admin.</p>}
      {products.length > 0 && (
        <section className="wrap sec">
          <div className="row"><h2>Produk Terbaru</h2>{products.length > 8 && <Link href="/?sec=terbaru" className="more">Lihat semua →</Link>}</div>
          <Grid items={products.slice(0, 8)} />
        </section>
      )}
    </>
  );
}

function Switch(props: Props) {
  const sp = useSearchParams();
  const { categories } = useSite();
  const q = (sp.get('q') || '').toLowerCase();
  const cat = sp.get('cat') || '';
  const sec = sp.get('sec') || '';
  if (!(q || cat || TITLES[sec])) return <Home {...props} />;
  const base = TITLES[sec] && !q && !cat ? pick(props.products, sec) : props.products;
  const r = base.filter((p) => (!cat || p.categoryId === cat) && (!q || p.name.toLowerCase().includes(q)));
  const title = q ? `Hasil untuk “${q}”` : cat ? categories.find((c) => c.id === cat)?.name || 'Kategori' : TITLES[sec];
  return (
    <section className="wrap sec"><h2>{title}</h2>
      {r.length ? <Grid items={r} /> : <p className="muted">Produk tidak ditemukan.</p>}
    </section>
  );
}

export default function HomeClient(props: Props) {
  return <Suspense fallback={<Home {...props} />}><Switch {...props} /></Suspense>;
}
