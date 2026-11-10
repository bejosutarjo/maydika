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
      defaults={{ active: true, popular: false, recommended: false, isMall: false, categoryId: '', rating: 0, ratingCount: 0, sold: 0 }}
      check={(d) => {
        if (!d.affiliateUrl && !d.tiktokUrl) return 'Isi minimal satu link: Shopee atau TikTok';
        if (d.promoPrice > 0 && d.promoPrice >= d.price) return 'Harga promosi harus lebih kecil dari harga normal';
        return null;
      }}
      fields={[
        { key: 'name', label: 'Nama produk', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea' },
        { key: 'price', label: 'Harga normal (Rp)', type: 'number', required: true },
        { key: 'promoPrice', label: 'Harga promosi (Rp)', type: 'number' },
        { key: 'categoryId', label: 'Kategori', type: 'select', options: cats.map((c) => ({ value: c.id, label: c.name })) },
        { key: 'image', label: 'Foto produk', type: 'image', required: true },
        { key: 'isMall', label: 'Toko Mall (tampilkan label Mall)', type: 'checkbox' },
        { key: 'rating', label: 'Rating (0–5)', type: 'number', maxNum: 5, step: 0.1, hint: 'Isi sesuai rating asli di marketplace.' },
        { key: 'ratingCount', label: 'Jumlah penilaian', type: 'number' },
        { key: 'sold', label: 'Jumlah terjual', type: 'number', hint: 'Isi sesuai angka asli di marketplace.' },
        { key: 'reviews', label: 'Ulasan terbaru', type: 'textarea', hint: 'Satu ulasan per baris: Nama | bintang | komentar. Baris paling atas = terbaru. Gunakan ulasan asli.' },
        { key: 'affiliateUrl', label: 'Link affiliate Shopee', type: 'shopee' },
        { key: 'tiktokUrl', label: 'Link affiliate TikTok', type: 'tiktok', hint: 'Boleh isi salah satu atau keduanya.' },
        { key: 'active', label: 'Tampilkan di website', type: 'checkbox' },
        { key: 'popular', label: 'Produk populer', type: 'checkbox' },
        { key: 'recommended', label: 'Rekomendasi', type: 'checkbox' },
      ]} />
  );
}
