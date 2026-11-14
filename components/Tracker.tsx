'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { lazyTrack } from '@/lib/trackLazy';

export default function Tracker() {
  const path = usePathname();
  useEffect(() => { if (path && !path.startsWith('/admin')) lazyTrack.page(); }, [path]);
  return null;
}
