'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSettings, listCol } from '@/lib/db';
import { Category, DEFAULT_SETTINGS, Settings } from '@/lib/types';

const Ctx = createContext<{ settings: Settings; categories: Category[]; reload: () => void }>({ settings: DEFAULT_SETTINGS, categories: [], reload: () => {} });
export const useSite = () => useContext(Ctx);

export default function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const reload = useCallback(() => {
    getSettings().then(setSettings);
    listCol<Category>('categories').then((c) => setCategories(c.sort((a, b) => a.name.localeCompare(b.name)))).catch(() => {});
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return <Ctx.Provider value={{ settings, categories, reload }}>{children}</Ctx.Provider>;
}
