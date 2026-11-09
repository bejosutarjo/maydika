'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, listCol } from '@/lib/db';
import { Category, DEFAULT_SETTINGS, Settings } from '@/lib/types';

const Ctx = createContext<{ settings: Settings; categories: Category[] }>({ settings: DEFAULT_SETTINGS, categories: [] });
export const useSite = () => useContext(Ctx);

export default function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    getSettings().then(setSettings);
    listCol<Category>('categories').then(setCategories).catch(() => {});
  }, []);
  return <Ctx.Provider value={{ settings, categories }}>{children}</Ctx.Provider>;
}
