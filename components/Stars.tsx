import type { CSSProperties } from 'react';
export default function Stars({ value, size }: { value: number; size?: string }) {
  const p = (Math.max(0, Math.min(5, value)) / 5) * 100;
  return <span className="stars" aria-label={`${value} dari 5`} style={{ '--p': `${p}%`, fontSize: size } as CSSProperties}>★★★★★</span>;
}
