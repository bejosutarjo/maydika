// Unsigned upload (tanpa API Secret). Batasi preset di dashboard Cloudinary.
export async function uploadImage(file: File, folder = 'maydika'): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error('Cloudinary belum dikonfigurasi (cek .env)');
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error('Format harus JPG, PNG, WEBP, atau GIF');
  if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran maksimal 5 MB');
  const fd = new FormData();
  fd.append('file', file); fd.append('upload_preset', preset); fd.append('folder', folder);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: fd });
  const j = await r.json();
  if (!r.ok || !j.secure_url) throw new Error(j.error?.message || 'Upload gagal');
  return j.secure_url as string;
}
