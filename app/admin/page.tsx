'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { listCol, removeItem, saveItem } from '@/lib/db';
import { placeholder } from '@/lib/util';
import Analytics from '@/components/Analytics';

export default function Dashboard() {
  const [n, setN] = useState<{ p: any[]; c: any[]; b: any[] } | null>(null);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    const [p, c, b] = await Promise.all([listCol<any>('products'), listCol<any>('categories'), listCol<any>('banners')]);
    setN({ p, c, b });
  }, []);
  useEffect(() => { load().catch((e) => setMsg(e.message)); }, [load]);

  async function seed() {
    try {
      const cats = [['Fashion', '👗', '#F4511E'], ['Elektronik', '🎧', '#FF7A00'], ['Rumah', '🏠', '#252525']];
      for (const [name, icon] of cats) await saveItem('categories', null, { name, icon, image: '', isDemo: true });
      const created = await listCol<any>('categories');
      const id = (nm: string) => created.find((c) => c.name === nm && c.isDemo)?.id || '';
      for (let i = 1; i <= 6; i++) {
        const [cn] = cats[i % 3];
        const price = 100000 + i * 25000;
        await saveItem('products', null, {
          name: `Produk Demo ${i}`, description: 'Ini adalah DATA DEMO. Hapus lewat dashboard dan ganti dengan produk asli Anda.',
          price, promoPrice: Math.round(price * 0.8), categoryId: id(cn), image: placeholder(`DEMO ${i}`), images: [placeholder(`DEMO ${i}`), placeholder(`DEMO ${i}-2`, '#252525', '#F4511E'), placeholder(`DEMO ${i}-3`, '#FF7A00', '#FFB400')],
          affiliateUrl: 'https://shopee.co.id/', tiktokUrl: i % 2 ? 'https://www.tiktok.com/' : '', storeName: 'Toko Demo', isMall: i % 3 === 0, rating: 4 + (i % 10) / 10, ratingCount: 20 * i, sold: 150 * i, reviews: 'Pembeli Demo | 5 | Contoh ulasan (DEMO), ganti dengan ulasan asli.\nPembeli Demo | 4 | Contoh ulasan kedua (DEMO).', active: true, popular: i % 2 === 0, recommended: i % 3 === 0, isDemo: true,
        });
      }
      await saveItem('banners', null, { title: 'Banner Demo', image: placeholder('BANNER DEMO', '#FF7A00', '#F4511E'), link: '', order: 1, active: true, isDemo: true });
      setMsg('Data demo dimuat.'); await load();
    } catch (e) { setMsg((e as Error).message); }
  }
  async function clearDemo() {
    if (!confirm('Hapus semua data demo?')) return;
    for (const [col, list] of [['products', n?.p], ['categories', n?.c], ['banners', n?.b]] as const)
      for (const i of list || []) if (i.isDemo) await removeItem(col, i.id);
    setMsg('Data demo dihapus.'); await load();
  }
  if (!n) return <div className="spin" />;
  const demo = [...n.p, ...n.c, ...n.b].some((i) => i.isDemo);
  return (
    <section>
      <h1>Dashboard</h1>
      <div className="stats">
        <div><b>{n.p.length}</b>Total Produk</div><div><b>{n.c.length}</b>Total Kategori</div><div><b>{n.b.length}</b>Total Banner</div>
        <div><b>{n.p.filter((p) => p.active).length}</b>Produk Tampil</div><div><b>{n.p.filter((p) => !p.active).length}</b>Produk Tersembunyi</div><div><b>{n.b.filter((b) => b.active).length}</b>Banner Aktif</div>
      </div>
      <Analytics products={n.p} categories={n.c} />
      <div className="row">
        {!n.p.length && <button className="btn" onClick={seed}>Muat data demo</button>}
        {demo && <button className="btn danger" onClick={clearDemo}>Hapus data demo</button>}
      </div>
      {msg && <p className="muted">{msg}</p>}
    </section>
  );
}
