'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = 'md_pwa_dismiss';
const BOT = /bot|crawl|spider|headless|lighthouse|pagespeed/i;

// Mendaftarkan service worker situs dan menampilkan ajakan "Pasang aplikasi" (bisa ditutup, muncul lagi setelah 7 hari).
export default function PwaInstall() {
  const path = usePathname();
  const [evt, setEvt] = useState<BIP | null>(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (BOT.test(navigator.userAgent)) return;
    const reg = () => { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {}); };
    if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg, { once: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (standalone) return;
    let dismissed = false;
    try { dismissed = Date.now() - Number(localStorage.getItem(KEY) || 0) < 7 * 86400e3; } catch { /* abaikan */ }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const on = (e: Event) => { e.preventDefault(); (window as unknown as { __bip?: Event }).__bip = e; setEvt(e as BIP); if (!dismissed) timers.push(setTimeout(() => setShow(true), 6000)); };
    const done = () => { setShow(false); setEvt(null); };
    window.addEventListener('beforeinstallprompt', on);
    window.addEventListener('appinstalled', done);
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) { setIos(true); if (!dismissed) timers.push(setTimeout(() => setShow(true), 8000)); }
    return () => { timers.forEach(clearTimeout); window.removeEventListener('beforeinstallprompt', on); window.removeEventListener('appinstalled', done); };
  }, []);

  if (!show || (!evt && !ios) || path?.startsWith('/admin') || path?.startsWith('/produk/') || path === '/install') return null;
  const dismiss = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* abaikan */ } setShow(false); };
  const install = async () => { if (!evt) return; await evt.prompt(); await evt.userChoice; setEvt(null); setShow(false); };
  return (
    <div className="pwa-bar" role="dialog" aria-label="Pasang aplikasi">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/app-192.png" alt="" width={40} height={40} />
      <div><b>Pasang aplikasi MAYDIKA</b><small>{evt ? 'Akses lebih cepat dari layar utama' : 'Ketuk Bagikan, lalu “Tambah ke Layar Utama”'}</small></div>
      {evt && <button type="button" className="pwa-go" onClick={install}>Pasang</button>}
      <button type="button" className="pwa-x" onClick={dismiss} aria-label="Tutup">✕</button>
    </div>
  );
}
