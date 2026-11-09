import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_SETTINGS, Settings } from './types';

export async function listCol<T>(col: string, publicOnly = false): Promise<(T & { id: string })[]> {
  const ref = collection(db, col);
  const q = publicOnly && col !== 'categories' ? query(ref, where('active', '==', true)) : ref;
  const s = await getDocs(q);
  return s.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
}
export async function getItem<T>(col: string, id: string): Promise<(T & { id: string }) | null> {
  try { const s = await getDoc(doc(db, col, id)); return s.exists() ? ({ id: s.id, ...s.data() } as T & { id: string }) : null; }
  catch { return null; }
}
export async function saveItem(col: string, id: string | null, data: Record<string, unknown>) {
  if (id) await updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
  else await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
}
export const removeItem = (col: string, id: string) => deleteDoc(doc(db, col, id));
export async function getSettings(): Promise<Settings> {
  try { const s = await getDoc(doc(db, 'settings', 'main')); return { ...DEFAULT_SETTINGS, ...(s.data() || {}) } as Settings; }
  catch { return DEFAULT_SETTINGS; }
}
export const saveSettings = (d: Partial<Settings>) => setDoc(doc(db, 'settings', 'main'), d, { merge: true });
export const byNewest = (a: { createdAt?: { seconds: number } }, b: { createdAt?: { seconds: number } }) =>
  (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
