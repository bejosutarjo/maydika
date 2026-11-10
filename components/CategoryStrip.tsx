'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { useSite } from './SiteProvider';

// Kategori ringkas: tampil satu baris, "Lihat semuanya" untuk membuka semua.
export default function CategoryStrip() {
  const { categories } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const measure = useCallback(() => {
    const el = ref.current;
    if (el && !open) setCanExpand(el.scrollHeight > el.clientHeight + 2);
  }, [open]);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, categories.length]);
  if (!categories.length) return null;
  return (
    <section className="wrap sec cat-sec">
      <div className="row">
        <h2>Kategori</h2>
        {(canExpand || open) && (
          <button type="button" className="more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? 'Tutup ▴' : 'Lihat semuanya ▾'}
          </button>
        )}
      </div>
      <div ref={ref} className={'catgrid' + (open ? '' : ' fold')}>
        {categories.map((c) => (
          <Link key={c.id} href={`/?cat=${c.id}`} className="cat">
            {c.image ? <Img src={c.image} alt="" w={120} sizes="40px" /> : <span className="ico">{c.icon || '🛍️'}</span>}
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
