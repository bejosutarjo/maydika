'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import AdminInstall from './AdminInstall';

const nav = [['/admin', 'Dashboard', '📊'], ['/admin/produk', 'Produk', '📦'], ['/admin/kategori', 'Kategori', '🗂️'], ['/admin/banner', 'Banner', '🖼️'], ['/admin/pengaturan', 'Pengaturan', '⚙️']];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'ok' | 'no'>('loading');
  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setState('loading');
    if (!u) return setState('no');
    try { setState((await getDoc(doc(db, 'owners', u.uid))).exists() ? 'ok' : 'no'); } catch { setState('no'); }
  }), []);
  useEffect(() => {
    if (state === 'no' && path !== '/admin/login') router.replace('/admin/login');
    if (state === 'ok' && path === '/admin/login') router.replace('/admin');
  }, [state, path, router]);

  if (path === '/admin/login') return <><div className="wrap pwa-top"><AdminInstall /></div>{children}</>;
  if (state !== 'ok') return <><AdminInstall /><div className="wrap"><div className="spin" /></div></>;
  const logout = () => signOut(auth);
  return (
    <div className="wrap adm">
      <div className="adm-top">
        <b>MAYDIKA Admin</b>
        <div><AdminInstall /><button onClick={logout}>Keluar</button></div>
      </div>
      <aside>
        {nav.map(([h, l]) => <Link key={h} href={h} className={path === h ? 'on' : ''}>{l}</Link>)}
        <Link href="/" target="_blank">Lihat Situs ↗</Link>
        <AdminInstall />
        <button onClick={logout}>Keluar</button>
      </aside>
      <div className="adm-main">{children}</div>
      <nav className="adm-bot" aria-label="Menu admin">
        {nav.map(([h, l, i]) => <Link key={h} href={h} className={path === h ? 'on' : ''}><span>{i}</span>{l}</Link>)}
      </nav>
    </div>
  );
}
