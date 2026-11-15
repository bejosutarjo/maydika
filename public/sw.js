// Service worker situs publik (scope "/"). Area /admin punya service worker sendiri (/admin-sw.js).
const V = 'maydika-v1';
const PAGES = V + '-pages';
const ASSETS = V + '-assets';
const OFFLINE = '/offline.html';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(ASSETS).then((c) => c.addAll([OFFLINE, '/icons/app-192.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => !k.startsWith(V)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

async function trim(name, max) {
  const c = await caches.open(name);
  const ks = await c.keys();
  if (ks.length > max) await Promise.all(ks.slice(0, ks.length - max).map((k) => c.delete(k)));
}
function put(name, req, res, max) {
  if (!res.ok || res.redirected) return;
  const cp = res.clone();
  caches.open(name).then((c) => c.put(req, cp)).then(() => trim(name, max)).catch(() => {});
}

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || u.pathname.startsWith('/admin') || u.pathname.startsWith('/api')) return;

  // Halaman: selalu coba jaringan dulu (data terbaru); jika offline pakai salinan terakhir atau halaman offline.
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { put(PAGES, r, res, 30); return res; })
      .catch(async () => (await caches.match(r)) || (await caches.match(OFFLINE))));
    return;
  }
  // Berkas statis berversi: cache dulu.
  if (u.pathname.startsWith('/_next/static/') || u.pathname.startsWith('/icons/')) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { put(ASSETS, r, res, 120); return res; })));
  }
});
