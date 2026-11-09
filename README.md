# MAYDIKA AFFILIATE

Next.js 14 (App Router) + TypeScript + Firebase (Auth, Firestore) + Cloudinary. Siap deploy ke Vercel.

## 1. Firebase
1. Buat project di console.firebase.google.com → tambah **Web app** → salin config ke `.env.local`.
2. **Authentication** → Sign-in method → aktifkan **Email/Password** → tab Users → **Add user** (akun Owner). Salin **User UID**.
3. **Firestore Database** → buat database. Buat koleksi `owners`, dokumen ber-ID = UID Owner (isi field apa saja, mis. `role: "owner"`).
4. **Rules** → tempel isi `firestore.rules` → Publish.
5. Authentication → Settings → Authorized domains → tambahkan domain Vercel Anda.

## 2. Cloudinary
1. Settings → Upload → **Add upload preset** → Signing mode: **Unsigned**.
2. Batasi: folder `maydika`, allowed formats `jpg,png,webp,gif`, max file size 5 MB.
3. Isi `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` dan `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. **Jangan** pernah memasukkan API Secret.

## 3. Jalankan lokal
```
cp .env.example .env.local   # isi semua nilai
npm install
npm run dev                  # http://localhost:3000  | admin: /admin
```

## 4. Deploy Vercel
Push ke GitHub → Import di Vercel → tambahkan semua variabel `.env.example` di Environment Variables (set `NEXT_PUBLIC_SITE_URL` ke domain final) → Deploy.

## 5. Pertama kali
Login di `/admin/login` → Dashboard → **Muat data demo** (opsional; semua bertanda DEMO, bisa dihapus sekali klik).

## Keamanan
- Hanya UID di koleksi `owners` yang bisa menulis (dicek di Firestore Rules, bukan hanya di UI).
- Pengunjung hanya bisa membaca produk/banner `active == true`.
- Link affiliate divalidasi (https + domain Shopee) di form **dan** di Rules.
- Tidak ada checkout; tombol beli membuka link affiliate Shopee.
