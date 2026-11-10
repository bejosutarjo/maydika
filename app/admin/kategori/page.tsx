'use client';
import CrudPage from '@/components/CrudPage';
export default function KategoriAdmin() {
  return <CrudPage col="categories" title="Kategori" titleKey="name" imageKey="image" subtitle={(i) => i.icon} defaults={{}}
    fields={[
      { key: 'name', label: 'Nama kategori', type: 'text', required: true, max: 60 },
      { key: 'icon', label: 'Ikon kategori', type: 'icon', max: 8 },
      { key: 'image', label: 'Gambar kategori', type: 'image' },
    ]} />;
}
