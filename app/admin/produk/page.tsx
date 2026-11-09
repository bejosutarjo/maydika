'use client';
import { useEffect, useState } from 'react';
import CrudPage from '@/components/CrudPage';
import { listCol } from '@/lib/db';
import { Category } from '@/lib/types';
import { rupiah } from '@/lib/util';

export default function ProdukAdmin() {
  const [cats, setCats] = useState<Category[] | null>(null);
  useEffect(() => { listCol<Category>('categories').then(setCats).catch(() => setCats([])); }, []);
  if (!cats) return <div className="spin" />;
  return (
    <CrudPage col="products" title="Produk" titleKey="name" imageKey="image"
      subtitle={(i) => rupiah(i.promoPrice > 0 ? i.promoPrice : i.price)}
      defaults={{ active: true, popular: false, recommended: false, categoryId: '' }}
      check={(d) => (d.promoPrice > 0 && d.promoPrice >= d.price ? 'Harga promosi harus lebih kecil dari harga normal' : null)}
      fields={[
        { key: 'name', label: 'Nama produk', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea' },
        { key: 'price', label: 'Harga normal (Rp)', type: 'number', required: true },
        { key: 'promoPrice', label: 'Harga promosi (Rp)', type: 'number' },
        { key: 'categoryId', label: 'Kategori', type: 'select', options: cats.map((c) => ({ value: c.id, label: c.name })) },
        { key: 'image', label: 'Foto produk', type: 'image', required: true },
        { key: 'affiliateUrl', label: 'Link affiliate Shopee', type: 'shopee', required: true },
        { key: 'active', label: 'Tampilkan di website', type: 'checkbox' },
        { key: 'popular', label: 'Produk populer', type: 'checkbox' },
        { key: 'recommended', label: 'Rekomendasi', type: 'checkbox' },
      ]} />
  );
}
