'use client';
import { useEffect, useState } from 'react';

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// Mendaftarkan service worker area /admin dan menampilkan tombol "Pasang Aplikasi".
export default function AdminInstall() {
  const [evt, setEvt] = useState<BIP | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);
    const on = (e: Event) => { e.preventDefault(); setEvt(e as BIP); };
    const done = () => { setInstalled(true); setEvt(null); };
    window.addEventListener('beforeinstallprompt', on);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', on); window.removeEventListener('appinstalled', done); };
  }, []);

  if (installed) return null;
  if (evt) return <button type="button" className="pwa-btn" onClick={async () => { await evt.prompt(); await evt.userChoice; setEvt(null); }}>📲<span className="pwa-t"> Pasang Aplikasi</span></button>;
  if (ios) return (
    <span className="pwa-wrap">
      <button type="button" className="pwa-btn" onClick={() => setHint((v) => !v)}>📲<span className="pwa-t"> Pasang Aplikasi</span></button>
      {hint && <small className="pwa-hint">Ketuk ikon Bagikan, lalu pilih “Tambah ke Layar Utama”.</small>}
    </span>
  );
  return null;
}
