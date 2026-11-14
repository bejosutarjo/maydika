import { doc, increment, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { shouldSkip as skip } from './skip';

// Statistik anonim (tanpa data pribadi). Tanggal memakai WIB (UTC+7).
const day = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const fire = (p: Promise<unknown>) => { p.catch(() => {}); };

export function trackPageView() {
  if (skip()) return;
  const d = day();
  const data: Record<string, unknown> = { date: d, views: increment(1) };
  try {
    const k = 'md_v_' + d;
    if (!localStorage.getItem(k)) { localStorage.setItem(k, '1'); data.visitors = increment(1); }
  } catch { /* abaikan */ }
  fire(setDoc(doc(db, 'stats_daily', d), data, { merge: true }));
}
export function trackProductView(pid: string) {
  if (skip() || !/^[A-Za-z0-9]{1,40}$/.test(pid)) return;
  const d = day();
  fire(setDoc(doc(db, 'product_daily', `${d}_${pid}`), { date: d, pid, views: increment(1) }, { merge: true }));
}
export function trackClick(pid: string, platform: 'shopee' | 'tiktok') {
  if (skip() || !/^[A-Za-z0-9]{1,40}$/.test(pid)) return;
  const d = day();
  const f = platform === 'tiktok' ? 'clicksTiktok' : 'clicksShopee';
  fire(setDoc(doc(db, 'product_daily', `${d}_${pid}`), { date: d, pid, [f]: increment(1) }, { merge: true }));
  fire(setDoc(doc(db, 'stats_daily', d), { date: d, clicks: increment(1) }, { merge: true }));
}
