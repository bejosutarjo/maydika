export const rupiah = (n: number) => 'Rp' + Math.round(n || 0).toLocaleString('id-ID');
export const clean = (s: unknown, max = 200) => String(s ?? '').replace(/<[^>]*>/g, '').replace(/\s+\n/g, '\n').trim().slice(0, max);
export function isHttpsUrl(u: string) { try { return new URL(u).protocol === 'https:'; } catch { return false; } }
export function isShopeeUrl(u: string) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && /(^|\.)(shopee\.[a-z.]+|shope\.ee|shp\.ee)$/.test(x.hostname);
  } catch { return false; }
}
export function optimize(url: string, w: number) {
  return url.includes('res.cloudinary.com') && url.includes('/upload/')
    ? url.replace('/upload/', `/upload/f_auto,q_auto${w <= 800 ? ':eco' : ''},c_limit,w_${w}/`) : url;
}
export function srcSet(url: string) {
  return url.includes('res.cloudinary.com') ? [320, 480, 640, 800, 1024, 1600].map((w) => `${optimize(url, w)} ${w}w`).join(', ') : undefined;
}
export const placeholder = (label: string, c1 = '#F4511E', c2 = '#FF7A00') =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><text x="400" y="410" font-family="sans-serif" font-size="56" fill="#fff" text-anchor="middle">${label}</text></svg>`);
export const discount = (p: { price: number; promoPrice: number }) =>
  p.promoPrice > 0 && p.promoPrice < p.price ? Math.round((1 - p.promoPrice / p.price) * 100) : 0;
export function isTiktokUrl(u: string) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && /(^|\.)(tiktok\.com|tiktokshop\.com|tokopedia\.com|tokopedia\.link)$/.test(x.hostname);
  } catch { return false; }
}
export function formatCount(n: number) {
  n = Math.round(n || 0);
  const f = (v: number, s: string) => v.toFixed(1).replace(/\.0$/, '').replace('.', ',') + s;
  return n >= 1e6 ? f(n / 1e6, 'jt') : n >= 1000 ? f(n / 1000, 'rb') : String(n);
}
export type Review = { name: string; rating: number; text: string };
// Format per baris: Nama | bintang (1-5) | komentar
export function parseReviews(raw?: string): Review[] {
  return String(raw || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 30).map((l) => {
    const [name, r, ...t] = l.split('|');
    const n = Number(r);
    return { name: clean(name, 40) || 'Pembeli', rating: Number.isFinite(n) ? Math.min(5, Math.max(1, Math.round(n))) : 5, text: clean(t.join('|'), 400) };
  }).filter((r) => r.text);
}
