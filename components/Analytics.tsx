'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { saveItem } from '@/lib/db';
import { Category, Product } from '@/lib/types';
import { Day, Mode, PS, Suggestion, addDays, aggregate, buckets, buildSuggestions, summary, today } from '@/lib/analytics';

const n = (v: number) => Math.round(v).toLocaleString('id-ID');
const MODES: [Mode, string][] = [['hari', 'Harian'], ['minggu', 'Mingguan'], ['bulan', 'Bulanan'], ['tahun', 'Tahunan']];
const LV = { hot: '🔥', warn: '⚠️', tip: '💡' } as const;

export default function Analytics({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [days, setDays] = useState<Day[] | null>(null);
  const [ps, setPs] = useState<Map<string, PS> | null>(null);
  const [prods, setProds] = useState(products);
  const [mode, setMode] = useState<Mode>('hari');
  const [period, setPeriod] = useState(30);
  const [all, setAll] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => setProds(products), [products]);
  useEffect(() => {
    getDocs(query(collection(db, 'stats_daily'), where('date', '>=', addDays(today(), -730))))
      .then((s) => setDays(s.docs.map((d) => { const x = d.data(); return { date: String(x.date || d.id), views: Number(x.views) || 0, visitors: Number(x.visitors) || 0, clicks: Number(x.clicks) || 0 }; })))
      .catch((e) => { setDays([]); setErr(e.message); });
  }, []);
  useEffect(() => {
    setPs(null);
    getDocs(query(collection(db, 'product_daily'), where('date', '>=', addDays(today(), -(period - 1)))))
      .then((s) => setPs(aggregate(s.docs.map((d) => d.data()))))
      .catch((e) => { setPs(new Map()); setErr(e.message); });
  }, [period]);

  const sm = useMemo(() => (days ? summary(days) : null), [days]);
  const bk = useMemo(() => (days ? buckets(days, mode) : []), [days, mode]);
  const max = Math.max(1, ...bk.map((b) => b.visitors));
  const rows = useMemo(() => prods.map((p) => ({ p, s: ps?.get(p.id) || { views: 0, cs: 0, ct: 0 } })), [prods, ps]);
  const clicks = (r: { s: PS }) => r.s.cs + r.s.ct;
  const sorted = useMemo(() => [...rows].sort((a, b) => clicks(b) - clicks(a) || b.s.views - a.s.views), [rows]);
  const topClick = sorted.filter((r) => clicks(r) > 0).slice(0, 5);
  const topMax = Math.max(1, ...topClick.map(clicks));
  const hasTraffic = !!days && days.some((d) => d.visitors > 0 || d.views > 0);
  const sug = useMemo(() => (ps ? buildSuggestions(prods, ps, categories, period, hasTraffic) : []), [prods, ps, categories, period, hasTraffic]);

  async function apply(s: Suggestion) {
    if (!s.pid || !s.patch) return;
    try { await saveItem('products', s.pid, s.patch); setProds((l) => l.map((p) => (p.id === s.pid ? { ...p, ...s.patch } as Product : p))); setMsg('Perubahan disimpan.'); }
    catch (e) { setMsg((e as Error).message); }
  }

  return (
    <div className="an">
      {err && <p className="err">Gagal memuat statistik: {err}. Pastikan firestore.rules terbaru sudah dipublish.</p>}

      <section className="an-sec">
        <h2>📈 Kunjungan Website</h2>
        {!sm ? <div className="spin" /> : (
          <>
            <div className="an-cards">
              {([['Hari ini', 'hari'], ['7 hari terakhir', 'minggu'], ['Bulan ini', 'bulan'], ['Tahun ini', 'tahun']] as const).map(([l, k]) => (
                <div className="an-card" key={k}><small>{l}</small><b>{n(sm[k].visitors)}</b><span>kunjungan</span><em>{n(sm[k].views)} tayangan · {n(sm[k].clicks)} klik beli</em></div>
              ))}
            </div>
            <div className="an-tabs">{MODES.map(([m, l]) => <button key={m} type="button" className={m === mode ? 'on' : ''} onClick={() => setMode(m)}>{l}</button>)}</div>
            <div className="an-chart" role="img" aria-label="Grafik kunjungan">
              {bk.map((b, i) => (
                <div className="an-col" key={i} title={`${b.label}: ${b.visitors} kunjungan, ${b.views} tayangan, ${b.clicks} klik`}>
                  <em>{bk.length <= 12 && b.visitors > 0 ? b.visitors : ''}</em>
                  <div className="an-bar"><i style={{ height: `${(b.visitors / max) * 100}%` }} /></div>
                  <span>{bk.length <= 12 || i % 5 === 0 || i === bk.length - 1 ? b.label : ''}</span>
                </div>
              ))}
            </div>
            <table className="an-tbl"><thead><tr><th>Periode</th><th>Kunjungan</th><th>Tayangan</th><th>Klik</th></tr></thead>
              <tbody>{[...bk].reverse().slice(0, 7).map((b, i) => <tr key={i}><td>{b.label}</td><td>{n(b.visitors)}</td><td>{n(b.views)}</td><td>{n(b.clicks)}</td></tr>)}</tbody>
            </table>
            <small className="muted">Kunjungan = pengunjung unik per hari (per browser). Tayangan = jumlah halaman dibuka. Waktu mengikuti WIB. Kunjungan Owner dan bot tidak dihitung.</small>
          </>
        )}
      </section>

      <section className="an-sec">
        <div className="row"><h2>🏆 Analitik Produk</h2>
          <div className="an-tabs">{[7, 30, 90].map((d) => <button key={d} type="button" className={d === period ? 'on' : ''} onClick={() => setPeriod(d)}>{d} hari</button>)}</div>
        </div>
        {!ps ? <div className="spin" /> : (
          <>
            <h3>Produk Terbanyak Diklik</h3>
            {!topClick.length ? <p className="muted">Belum ada klik beli pada periode ini.</p> : (
              <ol className="an-top">
                {topClick.map((r, i) => (
                  <li key={r.p.id}>
                    <span className="rk">{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.p.image} alt="" />
                    <div><b>{r.p.name}</b><div className="an-line"><i style={{ width: `${(clicks(r) / topMax) * 100}%` }} /></div>
                      <small>{clicks(r)} klik · Shopee {r.s.cs} · TikTok {r.s.ct}</small></div>
                  </li>
                ))}
              </ol>
            )}
            <h3>Performa Semua Produk</h3>
            <div className="an-scroll">
              <table className="an-tbl"><thead><tr><th>Produk</th><th>Dilihat</th><th>Klik</th><th>CTR</th></tr></thead>
                <tbody>{(all ? sorted : sorted.slice(0, 10)).map((r) => (
                  <tr key={r.p.id}><td className="nm">{r.p.name}{!r.p.active && <span className="tag off">Tersembunyi</span>}</td><td>{n(r.s.views)}</td><td>{n(clicks(r))}</td><td>{r.s.views > 0 ? ((clicks(r) / r.s.views) * 100).toFixed(1) + '%' : '–'}</td></tr>
                ))}</tbody>
              </table>
            </div>
            {sorted.length > 10 && <button type="button" className="more" onClick={() => setAll((v) => !v)}>{all ? 'Tutup ▴' : `Lihat semua (${sorted.length}) ▾`}</button>}
            <small className="muted">CTR = klik beli ÷ dilihat. Produk dihitung dilihat saat halaman detailnya dibuka.</small>
          </>
        )}
      </section>

      <section className="an-sec">
        <h2>💡 Saran Produk</h2>
        {!ps ? <div className="spin" /> : !sug.length ? <p className="muted">Belum ada saran. Semuanya terlihat baik!</p> : (
          <ul className="an-sug">
            {sug.map((s) => (
              <li key={s.id} className={s.level}>
                <span className="lv">{LV[s.level]}</span>
                <div><b>{s.title}</b><p>{s.text}</p>
                  <div className="sg-act">
                    {s.actionLabel && <button type="button" className="btn sm" onClick={() => apply(s)}>{s.actionLabel}</button>}
                    {s.pid && <Link className="btn sm ghost" href="/admin/produk">Edit produk</Link>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {msg && <small className="muted">{msg}</small>}
        <small className="muted">Saran dibuat otomatis dari data klik, tayangan, dan kelengkapan produk dalam {period} hari terakhir.</small>
      </section>
    </div>
  );
}
