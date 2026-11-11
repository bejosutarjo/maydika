// Fetch server-side via Firestore REST (untuk metadata SEO & sitemap). Hanya data aktif.
const PID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents`;
/* eslint-disable @typescript-eslint/no-explicit-any */
const val = (v: any): any => v.stringValue ?? (v.integerValue !== undefined ? Number(v.integerValue) : v.doubleValue ?? v.booleanValue ?? v.timestampValue ?? null);
const parse = (d: any) => ({ id: String(d.name).split('/').pop() as string, _updated: d.updateTime as string | undefined, ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, val(v)])) }) as Record<string, any>;

export async function fetchProduct(id: string) {
  if (!PID || !/^[A-Za-z0-9]+$/.test(id)) return null;
  try {
    const r = await fetch(`${BASE}/products/${id}`, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    const p = parse(await r.json());
    return p.active ? p : null;
  } catch { return null; }
}
export async function fetchActiveProducts() {
  if (!PID) return [];
  try {
    const r = await fetch(`${BASE}:runQuery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, next: { revalidate: 3600 },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'products' }], where: { fieldFilter: { field: { fieldPath: 'active' }, op: 'EQUAL', value: { booleanValue: true } } }, limit: 500 } }),
    });
    const j = await r.json();
    return (j as any[]).filter((x) => x.document).map((x) => parse(x.document));
  } catch { return []; }
}
export async function fetchSettings() {
  if (!PID) return null;
  try {
    const r = await fetch(`${BASE}/settings/main`, { next: { revalidate: 300 } });
    return r.ok ? parse(await r.json()) : null;
  } catch { return null; }
}

export function siteUrl() {
  const e = process.env.NEXT_PUBLIC_SITE_URL;
  if (e) return e.replace(/\/$/, '');
  const v = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return v ? `https://${v}` : 'http://localhost:3000';
}
