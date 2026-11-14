/* eslint-disable @typescript-eslint/no-explicit-any */
// Ambil data publik di server lewat Firestore REST (di-cache/ISR), sehingga halaman langsung berisi konten.
import { DEFAULT_SETTINGS } from './types';
import type { Banner, Category, Product, Settings } from './types';

const PID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents`;
const REVAL = 60;

const val = (v: any): any => {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return { seconds: Math.floor(Date.parse(v.timestampValue) / 1000) };
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  return null;
};
const parse = (d: any) => ({
  id: String(d.name).split('/').pop() as string,
  _updated: d.updateTime as string | undefined,
  ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, val(v)])),
}) as Record<string, any>;

async function runQ(collectionId: string, activeOnly: boolean, revalidate = REVAL): Promise<Record<string, any>[]> {
  if (!PID) return [];
  try {
    const sq: any = { from: [{ collectionId }], limit: 500 };
    if (activeOnly) sq.where = { fieldFilter: { field: { fieldPath: 'active' }, op: 'EQUAL', value: { booleanValue: true } } };
    const r = await fetch(`${BASE}:runQuery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, next: { revalidate },
      body: JSON.stringify({ structuredQuery: sq }),
    });
    if (!r.ok) return [];
    const j = await r.json();
    return (j as any[]).filter((x) => x.document).map((x) => parse(x.document));
  } catch { return []; }
}

export async function fetchProduct(id: string) {
  if (!PID || !/^[A-Za-z0-9]+$/.test(id)) return null;
  try {
    const r = await fetch(`${BASE}/products/${id}`, { next: { revalidate: REVAL } });
    if (!r.ok) return null;
    const p = parse(await r.json());
    return p.active ? p : null;
  } catch { return null; }
}
export const fetchActiveProducts = () => runQ('products', true, 3600);
export async function fetchProducts() {
  return (await runQ('products', true)).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}
export async function fetchBanners() {
  return (await runQ('banners', true)).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}
export async function fetchCategories() {
  return (await runQ('categories', false)).sort((a, b) => String(a.name).localeCompare(String(b.name)));
}
export async function fetchSettings() {
  if (!PID) return null;
  try {
    const r = await fetch(`${BASE}/settings/main`, { next: { revalidate: 300 } });
    return r.ok ? parse(await r.json()) : null;
  } catch { return null; }
}

// Versi ringkas (hanya yang dibutuhkan kartu/daftar) agar HTML dan JS tetap kecil.
export function slim(p: any): Product {
  return {
    id: p.id, name: p.name || '', description: '', price: Number(p.price) || 0, promoPrice: Number(p.promoPrice) || 0,
    categoryId: p.categoryId || '', image: p.image || '', affiliateUrl: p.affiliateUrl || '', tiktokUrl: p.tiktokUrl || '',
    active: true, popular: !!p.popular, recommended: !!p.recommended, isDemo: !!p.isDemo, isMall: !!p.isMall,
    rating: Number(p.rating) || 0, sold: Number(p.sold) || 0,
    ...(p.createdAt ? { createdAt: p.createdAt } : {}),
  };
}
export const slimBanner = (b: any): Banner => ({ id: b.id, title: b.title || '', image: b.image || '', link: b.link || '', order: Number(b.order) || 0, active: true });
export const slimCategory = (c: any): Category => ({ id: c.id, name: c.name || '', icon: c.icon || '', image: c.image || '' });
export function slimSettings(s: Record<string, any> | null): Partial<Settings> {
  const out: Record<string, string> = {};
  if (s) for (const k of Object.keys(DEFAULT_SETTINGS)) if (typeof s[k] === 'string') out[k] = s[k];
  return out as Partial<Settings>;
}

export function siteUrl() {
  // Prioritas: env → domain utama maydika.my.id (tidak pernah localhost / vercel.app).
  let e = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
  if (e && !/^https?:\/\//i.test(e)) e = 'https://' + e;
  return e || 'https://maydika.my.id';
}
