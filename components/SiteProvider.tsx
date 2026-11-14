'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { Category, DEFAULT_SETTINGS, Settings } from '@/lib/types';

const Ctx = createContext<{ settings: Settings; categories: Category[]; reload: () => void }>({ settings: DEFAULT_SETTINGS, categories: [], reload: () => {} });
export const useSite = () => useContext(Ctx);

type Props = { children: React.ReactNode; initialSettings?: Partial<Settings>; initialCategories?: Category[] };

export default function SiteProvider({ children, initialSettings, initialCategories }: Props) {
  const [settings, setSettings] = useState<Settings>({ ...DEFAULT_SETTINGS, ...(initialSettings || {}) });
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  // Dipakai dashboard admin setelah mengubah data; Firebase SDK baru dimuat saat diperlukan.
  const reload = useCallback(() => {
    import('@/lib/db').then((db) => {
      db.getSettings().then(setSettings);
      db.listCol<Category>('categories').then((c) => setCategories(c.sort((a, b) => a.name.localeCompare(b.name)))).catch(() => {});
    });
  }, []);
  return <Ctx.Provider value={{ settings, categories, reload }}>{children}</Ctx.Provider>;
}
