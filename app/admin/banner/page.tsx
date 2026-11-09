'use client';
import CrudPage from '@/components/CrudPage';
export default function BannerAdmin() {
  return <CrudPage col="banners" title="Banner" titleKey="title" imageKey="image" subtitle={(i) => `Urutan ${i.order}`} defaults={{ active: true, order: 1 }}
    fields={[
      { key: 'title', label: 'Judul banner', type: 'text', max: 100 },
      { key: 'image', label: 'Gambar banner', type: 'image', required: true },
      { key: 'link', label: 'Link tujuan (opsional, https)', type: 'url' },
      { key: 'order', label: 'Urutan', type: 'number', required: true },
      { key: 'active', label: 'Aktif', type: 'checkbox' },
    ]} />;
}
