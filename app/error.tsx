'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <div className="wrap center"><h1>Terjadi kesalahan</h1><p>Silakan coba lagi.</p><button className="btn" onClick={reset}>Coba lagi</button></div>;
}
