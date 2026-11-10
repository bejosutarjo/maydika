'use client';
import { useMemo, useState } from 'react';
import { ICON_GROUPS, ICONS } from '@/lib/icons';

type Props = { value: string; onChange: (v: string) => void; hint?: string };

export default function IconPicker({ value, onChange, hint = '' }: Props) {
  const [q, setQ] = useState('');
  const [g, setG] = useState('Semua');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ICONS.filter((x) => (g === 'Semua' || x.g === g) && (!s || x.k.includes(s) || x.g.toLowerCase().includes(s)));
  }, [q, g]);
  const sug = useMemo(() => {
    const w = hint.toLowerCase().split(/[^a-z0-9]+/).filter((x) => x.length >= 3);
    return w.length ? ICONS.filter((x) => w.some((t) => x.k.includes(t))).slice(0, 8) : [];
  }, [hint]);
  const noEnter = (e: React.KeyboardEvent) => { if (e.key === 'Enter') e.preventDefault(); };

  return (
    <div className="ip">
      <div className="ip-cur">
        <span className="ico">{value || '🛍️'}</span>
        <div><b>Ikon kategori</b><br /><small className="muted">{value ? 'Ketuk ikon lain untuk mengganti' : 'Pilih ikon di bawah'}</small></div>
        {value && <button type="button" className="ip-clr" onClick={() => onChange('')}>Hapus</button>}
      </div>
      {sug.length > 0 && (
        <div className="ip-sug"><small>Saran:</small>
          {sug.map((x) => <button key={x.i} type="button" className={'ip-i' + (x.i === value ? ' on' : '')} onClick={() => onChange(x.i)} aria-label={x.k}>{x.i}</button>)}
        </div>
      )}
      <input type="text" className="ip-q" placeholder="Cari ikon (mis. baju, laptop, dapur)…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={noEnter} />
      <div className="ip-tabs">
        {['Semua', ...ICON_GROUPS].map((t) => <button key={t} type="button" className={t === g ? 'on' : ''} onClick={() => setG(t)}>{t}</button>)}
      </div>
      <div className="ip-grid">
        {list.map((x) => <button key={x.i} type="button" className={'ip-i' + (x.i === value ? ' on' : '')} onClick={() => onChange(x.i)} aria-label={x.k} title={x.k.split(' ')[0]}>{x.i}</button>)}
        {!list.length && <small className="muted">Tidak ada ikon yang cocok.</small>}
      </div>
      <input type="text" className="ip-own" placeholder="Atau ketik/tempel emoji sendiri" value={value} maxLength={8} onChange={(e) => onChange(e.target.value)} onKeyDown={noEnter} />
    </div>
  );
}
