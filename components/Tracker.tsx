'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/track';

export default function Tracker() {
  const path = usePathname();
  useEffect(() => { if (path && !path.startsWith('/admin')) trackPageView(); }, [path]);
  return null;
}
