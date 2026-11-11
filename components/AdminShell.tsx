'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import AdminInstall from './AdminInstall';

const nav = [['/admin', 'Dashboard', '📊'], ['/admin/produk', 'Produk', '📦'], ['/admin/kategori', 'Kategori', '🗂️'], ['/admin/banner', 'Banner', '🖼️'], ['/admin/pengaturan', 'Pengaturan', '⚙️']];
const svg = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'ok' | 'no'>('loading');
  const [email, setEmail] = useState('');
  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setState('loading');
    setEmail(u?.email || '');
    if (!u) return setState('no');
    try { setState((await getDoc(doc(db, 'owners', u.uid))).exists() ? 'ok' : 'no'); } catch { setState('no'); }
  }), []);
  useEffect(() => {
    if (state === 'no' && path !== '/admin/login') router.replace('/admin/login');
    if (state === 'ok' && path === '/admin/login') router.replace('/admin');
  }, [state, path, router]);

  useEffect(() => { if (state === 'ok') { try { localStorage.setItem('md_owner', '1'); } catch { /* abaikan */ } } }, [state]);

  if (path === '/admin/login') return <><div className="wrap pwa-top"><AdminInstall /></div>{children}</>;
  if (state !== 'ok') return <><AdminInstall /><div className="wrap"><div className="spin" /></div></>;
  const cur = nav.find(([h]) => h === path)?.[1] ?? 'Dashboard';
  return (
    <div className="adm-root">
      <header className="adm-head">
        <div className="wrap adm-head-in">
          <Link href="/admin" className="adm-brand">
            <span className="logo-chip">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/icons/md-logo.png" alt="" /></span>
            <span><b>MAYDIKA Admin</b><small>{cur}</small></span>
          </Link>
          <div className="adm-head-act">
            {email && <span className="adm-user"><i>{email.charAt(0).toUpperCase()}</i>{email}</span>}
            <AdminInstall />
            <Link href="/" target="_blank" className="adm-btn" aria-label="Lihat situs"><svg {...svg}><path d="M14 3h7v7" /><path d="M21 3l-9 9" /><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></svg><span>Situs</span></Link>
            <button type="button" className="adm-btn" onClick={() => signOut(auth)} aria-label="Keluar"><svg {...svg}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg><span>Keluar</span></button>
          </div>
        </div>
      </header>
      <div className="wrap adm">
        <aside>
          <p className="adm-cap">MENU</p>
          {nav.map(([h, l, i]) => <Link key={h} href={h} className={'adm-li' + (path === h ? ' on' : '')}><span className="adm-ic">{i}</span>{l}</Link>)}
        </aside>
        <div className="adm-main">{children}</div>
      </div>
      <nav className="adm-bot" aria-label="Menu admin">
        {nav.map(([h, l, i]) => <Link key={h} href={h} className={path === h ? 'on' : ''}><span>{i}</span>{l}</Link>)}
      </nav>
    </div>
  );
}
