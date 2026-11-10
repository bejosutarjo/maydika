'use client';
import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/cloudinary';

const MAX = 5;

export default function MultiImageUpload({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const inp = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, MAX - value.length);
    e.target.value = '';
    if (!files.length) return;
    setErr(''); setBusy(true);
    const out = [...value];
    try { for (const f of files) out.push(await uploadImage(f)); }
    catch (x) { setErr((x as Error).message); }
    finally { onChange(out); setBusy(false); }
  }
  const move = (i: number, d: -1 | 1) => { const a = [...value]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a); };

  return (
    <div>
      <input ref={inp} type="file" multiple hidden accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} />
      <div className="mi">
        {value.map((u, i) => (
          <div className="mi-it" key={u + i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt={`Foto ${i + 1}`} />
            {i === 0 && <span className="mi-main">Utama</span>}
            <div className="mi-act">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Geser kiri">‹</button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Hapus foto">✕</button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Geser kanan">›</button>
            </div>
          </div>
        ))}
        {value.length < MAX && <button type="button" className="mi-add" disabled={busy} onClick={() => inp.current?.click()}>{busy ? '…' : '+'}</button>}
      </div>
      <small className="muted">{value.length}/{MAX} foto · foto pertama jadi foto utama · maks 5 MB per foto</small>
      {err && <small className="err"> {err}</small>}
    </div>
  );
}
