'use client';
import { useSite } from '@/components/SiteProvider';
export default function Syarat() {
  const { settings } = useSite();
  return <div className="wrap sec narrow"><h1>Syarat &amp; Ketentuan</h1><p className="desc">{settings.terms}</p></div>;
}
