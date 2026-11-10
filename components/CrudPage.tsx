'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { byNewest, listCol, removeItem, saveItem } from '@/lib/db';
import { clean, isHttpsUrl, isShopeeUrl, isTiktokUrl } from '@/lib/util';
import ImageUpload from './ImageUpload';
import { useSite } from './SiteProvider';

export type Field = {
  key: string; label: string; required?: boolean; max?: number; maxNum?: number; step?: number; hint?: string;
  type: 'text' | 'textarea' | 'number' | 'url' | 'shopee' | 'tiktok' | 'image' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
};
type Props = {
  col: string; title: string; fields: Field[]; defaults: Record<string, any>;
  titleKey: string; imageKey?: string; subtitle?: (i: any) => string;
  check?: (d: Record<string, any>) => string | null;
};

export default function CrudPage({ col, title, fields, defaults, titleKey, imageKey, subtitle, check }: Props) {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState<Record<string, any> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [qs, setQs] = useState('');
  const { reload } = useSite();
  const hasOrder = fields.some((f) => f.key === 'order');

  const load = useCallback(async () => {
    const l = await listCol<any>(col);
    setItems(l.sort((a, b) => (a.order !== undefined && b.order !== undefined ? a.order - b.order : byNewest(a, b))));
  }, [col]);
  useEffect(() => { load().catch((e) => { setItems([]); setErr(e.message); }); }, [load]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const data: Record<string, any> = {};
    for (const f of fields) {
      const raw = form[f.key];
      let v: any;
      if (f.type === 'checkbox') v = !!raw;
      else if (f.type === 'number') {
        if (raw === '' || raw === undefined || raw === null) { if (f.required) return setErr(`${f.label} wajib diisi`); v = 0; }
        else { v = Number(raw); if (!Number.isFinite(v) || v < 0) return setErr(`${f.label} harus angka ≥ 0`); if (f.maxNum !== undefined && v > f.maxNum) return setErr(`${f.label} maksimal ${f.maxNum}`); }
      } else {
        v = f.type === 'url' || f.type === 'shopee' || f.type === 'tiktok' || f.type === 'image' ? String(raw ?? '').trim() : clean(raw, f.max ?? (f.type === 'textarea' ? 5000 : 200));
        if (f.required && !v) return setErr(`${f.label} wajib diisi`);
        if (v && f.type === 'url' && !isHttpsUrl(v)) return setErr(`${f.label} harus URL https://`);
        if (v && f.type === 'tiktok' && !isTiktokUrl(v)) return setErr(`${f.label} harus link https TikTok (tiktok.com, tiktokshop.com, tokopedia.com/.link)`);
        if (v && f.type === 'shopee' && !isShopeeUrl(v)) return setErr(`${f.label} harus link https Shopee (shopee.co.id, shope.ee, shp.ee)`);
      }
      data[f.key] = v;
    }
    const m = check?.(data);
    if (m) return setErr(m);
    setBusy(true); setErr('');
    try { await saveItem(col, editId, data); setForm(null); await load(); if (col === 'categories') reload(); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  }
  async function del(i: any) {
    if (!confirm(`Hapus "${i[titleKey]}"?`)) return;
    try { await removeItem(col, i.id); await load(); if (col === 'categories') reload(); } catch (x) { setErr((x as Error).message); }
  }

  async function move(idx: number, dir: -1 | 1) {
    if (!items || idx + dir < 0 || idx + dir >= items.length) return;
    const a = [...items];
    [a[idx], a[idx + dir]] = [a[idx + dir], a[idx]];
    try { for (let k = 0; k < a.length; k++) if (a[k].order !== k + 1) await saveItem(col, a[k].id, { order: k + 1 }); await load(); } catch (x) { setErr((x as Error).message); }
  }
  async function toggle(i: any) {
    try { await saveItem(col, i.id, { active: !i.active }); await load(); } catch (x) { setErr((x as Error).message); }
  }
  const shown = (items || []).filter((i) => !qs || String(i[titleKey]).toLowerCase().includes(qs.toLowerCase()));
  return (
    <section>
      <div className="row"><h1>{title}</h1><button className="btn sm" onClick={() => { setForm({ ...defaults }); setEditId(null); setErr(''); }}>+ Tambah</button></div>
      {items && items.length > 6 && <input type="search" className="find" placeholder="Cari…" value={qs} onChange={(e) => setQs(e.target.value)} />}
      {err && !form && <p className="err">{err}</p>}
      {!items ? <div className="spin" /> : !items.length ? <p className="muted">Belum ada data.</p> : (
        <ul className="list">
          {shown.map((i) => (
            <li key={i.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {imageKey && i[imageKey] && <img src={i[imageKey]} alt="" />}
              <div><b>{i[titleKey]}</b>{i.isDemo && <span className="tag">DEMO</span>}{i.active === false && <span className="tag off">Tersembunyi</span>}<br /><small>{subtitle?.(i)}</small></div>
              {hasOrder && !qs && <><button className="btn sm ghost" aria-label="Naik" onClick={() => move(items.indexOf(i), -1)}>▲</button><button className="btn sm ghost" aria-label="Turun" onClick={() => move(items.indexOf(i), 1)}>▼</button></>}
              {typeof i.active === 'boolean' && <button className="btn sm ghost" onClick={() => toggle(i)}>{i.active ? 'Sembunyikan' : 'Tampilkan'}</button>}
              <button className="btn sm ghost" onClick={() => { setForm({ ...i }); setEditId(i.id); setErr(''); }}>Edit</button>
              <button className="btn sm danger" onClick={() => del(i)}>Hapus</button>
            </li>
          ))}
        </ul>
      )}
      {form && (
        <div className="modal" onClick={() => setForm(null)}>
          <form className="panel" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h2>{editId ? 'Edit' : 'Tambah'} {title}</h2>
            {fields.map((f) => (
              <label key={f.key} className={f.type === 'checkbox' ? 'chk' : ''}>
                <span>{f.label}{f.required && ' *'}</span>{f.hint && <small className="muted">{f.hint}</small>}
                {f.type === 'textarea' ? <textarea rows={5} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                  : f.type === 'image' ? <ImageUpload value={form[f.key] ?? ''} onChange={(u) => set(f.key, u)} />
                  : f.type === 'select' ? (
                    <select value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
                      <option value="">— Pilih —</option>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>)
                  : f.type === 'checkbox' ? <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
                  : <input type={f.type === 'number' ? 'number' : f.type === 'text' ? 'text' : 'url'} min={f.type === 'number' ? 0 : undefined} max={f.maxNum} step={f.type === 'number' ? f.step ?? 1 : undefined}
                      value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />}
              </label>
            ))}
            {err && <p className="err">{err}</p>}
            <div className="row"><button type="button" className="btn ghost" onClick={() => setForm(null)}>Batal</button><button className="btn" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan'}</button></div>
          </form>
        </div>
      )}
    </section>
  );
}
