// Ringan (tanpa Firebase): dipakai untuk memutuskan perlu tidaknya memuat modul pelacakan.
export function shouldSkip() {
  if (typeof window === 'undefined') return true;
  try { if (localStorage.getItem('md_owner')) return true; } catch { /* abaikan */ }
  return /bot|crawl|spider|headless|lighthouse|pagespeed/i.test(navigator.userAgent);
}
