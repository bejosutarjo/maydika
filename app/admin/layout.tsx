'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';

const nav = [['/admin', 'Dashboard'], ['/admin/produk', 'Produk'], ['/admin/kategori', 'Kategori'], ['/admin/banner', 'Banner'], ['/admin/pengaturan', 'Pengaturan']];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'ok' | 'no'>('loading');
  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setState('loading');
    if (!u) return setState('no');
    try { setState((await getDoc(doc(db, 'owners', u.uid))).exists() ? 'ok' : 'no'); } catch { setState('no'); }
  }), []);
  useEffect(() => { if (state === 'no' && path !== '/admin/login') router.replace('/admin/login'); }, [state, path, router]);

  if (path === '/admin/login') return <>{children}</>;
  if (state !== 'ok') return <div className="wrap"><div className="spin" /></div>;
  return (
    <div className="wrap adm">
      <aside>
        {nav.map(([h, l]) => <Link key={h} href={h} className={path === h ? 'on' : ''}>{l}</Link>)}
        <Link href="/" target="_blank">Lihat Situs ↗</Link>
        <button onClick={() => signOut(auth)}>Keluar</button>
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  );
}
