import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';
export default function Home() { return <Suspense fallback={<div className="wrap"><div className="spin" /></div>}><HomeClient /></Suspense>; }
