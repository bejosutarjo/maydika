'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { getSettings, saveSettings } from '@/lib/db';
import { DEFAULT_SETTINGS, Settings } from '@/lib/types';
import { clean, isHttpsUrl } from '@/lib/util';
import { useSite } from '@/components/SiteProvider';

const text: [keyof Settings, string][] = [['siteName', 'Nama website'], ['description', 'Deskripsi website'], ['whatsapp', 'WhatsApp (mis. 628123456789)'],
  ['instagram', 'Instagram (URL https)'], ['facebook', 'Facebook (URL https)'], ['tiktok', 'TikTok (URL https)'], ['youtube', 'YouTube (URL https)']];

export default function Pengaturan() {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState('');
  const { reload } = useSite();
  useEffect(() => { getSettings().then(setS); }, []);
  if (!s) return <div className="spin" />;
  const set = (k: keyof Settings, v: string) => setS({ ...s, [k]: v });
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    for (const k of ['instagram', 'facebook', 'tiktok', 'youtube'] as const) if (s[k] && !isHttpsUrl(s[k])) return setMsg(`${k}: harus URL https://`);
    const d: Settings = { ...DEFAULT_SETTINGS, ...s, siteName: clean(s.siteName, 60) || DEFAULT_SETTINGS.siteName, description: clean(s.description, 300),
      whatsapp: s.whatsapp.replace(/\D/g, '').slice(0, 16), terms: clean(s.terms, 10000) };
    try { await saveSettings(d); setS(d); reload(); setMsg('Tersimpan.'); } catch (x) { setMsg((x as Error).message); }
  }
  return (
    <form onSubmit={save} className="settings">
      <h1>Pengaturan Website</h1>
      <label><span>Logo</span><ImageUpload value={s.logo} onChange={(u) => set('logo', u)} /></label>
      {text.map(([k, l]) => <label key={k}><span>{l}</span><input value={s[k]} onChange={(e) => set(k, e.target.value)} /></label>)}
      <label><span>Syarat &amp; Ketentuan</span><textarea rows={8} value={s.terms} onChange={(e) => set('terms', e.target.value)} /></label>
      <label className="chk"><input type="checkbox" checked={s.detail === 'on'} onChange={(e) => set('detail', e.target.checked ? 'on' : 'off')} /><span>Aktifkan halaman detail produk (jika mati, kartu produk langsung membuka Shopee/TikTok)</span></label>
      <button className="btn">Simpan</button>
      {msg && <p className="muted">{msg}</p>}
    </form>
  );
}
