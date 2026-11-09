'use client';
import { useState } from 'react';
import { uploadImage } from '@/lib/cloudinary';

export default function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(''); setBusy(true);
    try { onChange(await uploadImage(f)); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); e.target.value = ''; }
  }
  return (
    <div className="upl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && <img src={value} alt="Pratinjau" />}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} disabled={busy} />
      {busy && <small>Mengunggah…</small>}
      {err && <small className="err">{err}</small>}
    </div>
  );
}
