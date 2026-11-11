/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category, Product } from './types';

export type Day = { date: string; views: number; visitors: number; clicks: number };
export type PS = { views: number; cs: number; ct: number };
export type Bucket = { label: string; views: number; visitors: number; clicks: number };
export type Mode = 'hari' | 'minggu' | 'bulan' | 'tahun';

export const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
export function addDays(d: string, n: number) { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); }
const weekStart = (d: string) => addDays(d, -((new Date(d + 'T00:00:00Z').getUTCDay() + 6) % 7));
const sum = (a: Day[]) => a.reduce((s, x) => ({ views: s.views + x.views, visitors: s.visitors + x.visitors, clicks: s.clicks + x.clicks }), { views: 0, visitors: 0, clicks: 0 });

export function summary(days: Day[]) {
  const t = today(), w = addDays(t, -6);
  return {
    hari: sum(days.filter((d) => d.date === t)),
    minggu: sum(days.filter((d) => d.date >= w && d.date <= t)),
    bulan: sum(days.filter((d) => d.date.slice(0, 7) === t.slice(0, 7))),
    tahun: sum(days.filter((d) => d.date.slice(0, 4) === t.slice(0, 4))),
  };
}
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export function buckets(days: Day[], mode: Mode): Bucket[] {
  const t = today();
  const key = (d: string) => (mode === 'hari' ? d : mode === 'minggu' ? weekStart(d) : mode === 'bulan' ? d.slice(0, 7) : d.slice(0, 4));
  const map = new Map<string, Day[]>();
  for (const d of days) { const k = key(d.date); const a = map.get(k) || []; a.push(d); map.set(k, a); }
  const keys: string[] = [];
  if (mode === 'hari') for (let i = 29; i >= 0; i--) keys.push(addDays(t, -i));
  else if (mode === 'minggu') for (let i = 11; i >= 0; i--) keys.push(addDays(weekStart(t), -7 * i));
  else if (mode === 'bulan') {
    let y = +t.slice(0, 4), m = +t.slice(5, 7);
    const arr: string[] = [];
    for (let i = 0; i < 12; i++) { arr.push(`${y}-${String(m).padStart(2, '0')}`); m--; if (m === 0) { m = 12; y--; } }
    keys.push(...arr.reverse());
  } else { const y = +t.slice(0, 4); keys.push(String(y - 1), String(y)); }
  return keys.map((k) => ({
    label: mode === 'hari' || mode === 'minggu' ? `${k.slice(8, 10)}/${k.slice(5, 7)}` : mode === 'bulan' ? MON[+k.slice(5, 7) - 1] : k,
    ...sum(map.get(k) || []),
  }));
}
export function aggregate(rows: Array<Record<string, any>>) {
  const m = new Map<string, PS>();
  for (const r of rows) {
    const pid = String(r.pid || '');
    if (!pid) continue;
    const s = m.get(pid) || { views: 0, cs: 0, ct: 0 };
    s.views += Number(r.views) || 0; s.cs += Number(r.clicksShopee) || 0; s.ct += Number(r.clicksTiktok) || 0;
    m.set(pid, s);
  }
  return m;
}

export type Suggestion = { id: string; level: 'hot' | 'warn' | 'tip'; title: string; text: string; pid?: string; actionLabel?: string; patch?: Record<string, unknown> };

export function buildSuggestions(prods: Product[], stats: Map<string, PS>, cats: Category[], period: number, hasTraffic: boolean): Suggestion[] {
  const out: Suggestion[] = [];
  const act = prods.filter((p) => p.active);
  const st = (p: Product): PS => stats.get(p.id) || { views: 0, cs: 0, ct: 0 };
  const clk = (p: Product) => st(p).cs + st(p).ct;
  const sh = (s: string) => (s.length > 40 ? s.slice(0, 38) + '…' : s);
  const names = (a: string[]) => a.slice(0, 3).map((x) => `“${sh(x)}”`).join(', ') + (a.length > 3 ? ` dan ${a.length - 3} lainnya` : '');

  [...act].filter((p) => clk(p) >= 3).sort((a, b) => clk(b) - clk(a)).slice(0, 3).forEach((p) => {
    if (!p.popular) out.push({ id: 'pop' + p.id, level: 'hot', pid: p.id, title: 'Naikkan ke Produk Populer', text: `“${sh(p.name)}” diklik ${clk(p)}× dalam ${period} hari. Tampilkan di halaman Populer agar makin laris.`, actionLabel: 'Tandai Populer', patch: { popular: true } });
    else if (!p.recommended) out.push({ id: 'rec' + p.id, level: 'hot', pid: p.id, title: 'Jadikan Produk Rekomendasi', text: `“${sh(p.name)}” sudah populer (${clk(p)} klik). Masukkan juga ke Rekomendasi agar muncul di bawah semua detail produk.`, actionLabel: 'Tandai Rekomendasi', patch: { recommended: true } });
  });
  act.filter((p) => st(p).views >= 15 && clk(p) / st(p).views < 0.03).sort((a, b) => st(b).views - st(a).views).slice(0, 3).forEach((p) =>
    out.push({ id: 'ctr' + p.id, level: 'warn', pid: p.id, title: 'Banyak dilihat, jarang diklik', text: `“${sh(p.name)}” dilihat ${st(p).views}× tetapi hanya ${clk(p)} klik beli. Coba perbaiki foto utama, judul, atau harga promosi.` }));
  const now = Date.now() / 1000;
  act.filter((p) => st(p).views === 0 && clk(p) === 0 && p.createdAt && (now - p.createdAt.seconds) / 86400 >= period).slice(0, 3).forEach((p) =>
    out.push({ id: 'dead' + p.id, level: 'warn', pid: p.id, title: 'Belum ada peminat', text: `“${sh(p.name)}” belum dilihat atau diklik dalam ${period} hari. Perbarui foto/judul, atau sembunyikan sementara.`, actionLabel: 'Sembunyikan', patch: { active: false } }));

  const byCat = new Map<string, number>();
  act.forEach((p) => { if (p.categoryId) byCat.set(p.categoryId, (byCat.get(p.categoryId) || 0) + clk(p)); });
  const top = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0];
  const topCat = top && top[1] >= 5 ? cats.find((c) => c.id === top[0]) : undefined;
  if (topCat && top) out.push({ id: 'topcat', level: 'tip', title: `Kategori ${topCat.name} paling diminati`, text: `${top[1]} klik beli dalam ${period} hari. Tambahkan lebih banyak produk di kategori ini.` });
  const emptyCats = cats.filter((c) => !prods.some((p) => p.categoryId === c.id));
  if (emptyCats.length) out.push({ id: 'emptycat', level: 'tip', title: 'Kategori belum punya produk', text: `${names(emptyCats.map((c) => c.name))} masih kosong. Isi produk atau hapus kategorinya agar tampilan rapi.` });

  const oneImg = act.filter((p) => (p.images?.length || (p.image ? 1 : 0)) < 2);
  if (oneImg.length) out.push({ id: 'img', level: 'tip', title: 'Tambah foto produk', text: `${names(oneImg.map((p) => p.name))} baru punya 1 foto. Tambahkan hingga 5 foto agar lebih meyakinkan.` });
  const noProof = act.filter((p) => !p.rating && !p.sold && !p.reviews);
  if (noProof.length) out.push({ id: 'proof', level: 'tip', title: 'Lengkapi rating, terjual & ulasan', text: `${names(noProof.map((p) => p.name))} belum memiliki rating, jumlah terjual, atau ulasan. Isi sesuai data asli di marketplace.` });
  const oneLink = act.filter((p) => !!p.affiliateUrl !== !!p.tiktokUrl);
  if (oneLink.length) out.push({ id: 'link', level: 'tip', title: 'Tambahkan link platform kedua', text: `${names(oneLink.map((p) => p.name))} hanya punya satu link (Shopee atau TikTok). Jika produknya ada di keduanya, tambahkan agar pembeli bisa memilih.` });
  const noCat = act.filter((p) => !p.categoryId);
  if (noCat.length) out.push({ id: 'nocat', level: 'tip', title: 'Pilih kategori produk', text: `${names(noCat.map((p) => p.name))} belum punya kategori sehingga sulit ditemukan.` });

  const rank = { hot: 0, warn: 1, tip: 2 };
  out.sort((a, b) => rank[a.level] - rank[b.level]);
  if (!hasTraffic) out.unshift({ id: 'notraffic', level: 'tip', title: 'Belum ada data kunjungan', text: 'Bagikan link website di bio TikTok/Instagram dan grup agar statistik mulai terisi.' });
  return out.slice(0, 10);
}
