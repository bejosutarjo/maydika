'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallPage() {
  const [evt, setEvt] = useState<BIP | null>(null);
  const [mode, setMode] = useState<'cek' | 'terpasang' | 'ios' | 'android'>('cek');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (standalone) { setMode('terpasang'); return; }
    setMode(/iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' : 'android');
    const early = (window as unknown as { __bip?: Event }).__bip; // event yang sudah ditangkap lebih awal
    if (early) setEvt(early as BIP);
    const on = (e: Event) => { e.preventDefault(); setEvt(e as BIP); };
    const ok = () => { setDone(true); setEvt(null); };
    window.addEventListener('beforeinstallprompt', on);
    window.addEventListener('appinstalled', ok);
    return () => { window.removeEventListener('beforeinstallprompt', on); window.removeEventListener('appinstalled', ok); };
  }, []);

  const install = async () => { if (!evt) return; await evt.prompt(); await evt.userChoice; setEvt(null); };

  return (
    <div className="wrap sec">
      <div className="inst">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/app-192.png" alt="" width={96} height={96} />
        <h1>Pasang Aplikasi MAYDIKA</h1>
        <p className="muted">Akses produk pilihan lebih cepat langsung dari layar utama, tanpa unduh dari toko aplikasi.</p>
        <ul className="inst-ben"><li>⚡ Terbuka cepat seperti aplikasi</li><li>📱 Layar penuh tanpa bilah browser</li><li>🪶 Ringan, hampir tanpa memakan memori</li></ul>

        {done && <p className="inst-ok">✅ Berhasil dipasang! Cek layar utama HP kamu.</p>}
        {mode === 'terpasang' && <><p className="inst-ok">✅ Aplikasi sudah terpasang di perangkat ini.</p><Link className="btn" href="/">Buka beranda</Link></>}
        {mode !== 'terpasang' && !done && evt && <button type="button" className="inst-btn" onClick={install}>📲 Pasang Sekarang</button>}
        {mode === 'ios' && !done && (
          <ol className="inst-steps"><li>Buka halaman ini di <b>Safari</b>.</li><li>Ketuk ikon <b>Bagikan</b> (kotak dengan panah ke atas).</li><li>Pilih <b>Tambah ke Layar Utama</b>, lalu ketuk <b>Tambah</b>.</li></ol>
        )}
        {mode === 'android' && !done && !evt && (
          <ol className="inst-steps"><li>Buka halaman ini di <b>Chrome</b> (bukan dari dalam WhatsApp/Instagram).</li><li>Ketuk menu <b>⋮</b> di pojok kanan atas.</li><li>Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.</li></ol>
        )}
        {mode === 'cek' && <p className="muted">Memeriksa perangkat…</p>}
      </div>
    </div>
  );
}
