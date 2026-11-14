'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Product } from '@/lib/types';
import { discount, formatCount, parseReviews, rupiah } from '@/lib/util';
import Img from './Img';
import ProductCard from './ProductCard';
import Stars from './Stars';
import { ShopeeIcon, TikTokIcon } from './PlatformIcons';
import { useSite } from './SiteProvider';
import { lazyTrack } from '@/lib/trackLazy';

// 10 produk acak; produk bertanda "Rekomendasi" diutamakan, sisanya diisi produk lain.
function pickRecommendations(all: Product[], n = 10) {
  const shuffle = (a: Product[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  return [...shuffle(all.filter((p) => p.recommended)), ...shuffle(all.filter((p) => !p.recommended))].slice(0, n);
}

export default function ProductView({ product: p, pool }: { product: Product; pool: Product[] }) {
  const [rel, setRel] = useState<Product[]>([]);
  const [openDesc, setOpenDesc] = useState(false);
  const [allRv, setAllRv] = useState(false);
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const { categories } = useSite();
  useEffect(() => { setRel(pickRecommendations(pool)); lazyTrack.view(p.id); }, [pool, p.id]);

  const d = discount(p);
  const now = d > 0 ? p.promoPrice : p.price;
  const cat = categories.find((c) => c.id === p.categoryId);
  const rv = parseReviews(p.reviews);
  const avg = (p.rating || 0) > 0 ? p.rating || 0 : rv.length ? rv.reduce((s, r) => s + r.rating, 0) / rv.length : 0;
  const sold = p.sold || 0;
  const rc = p.ratingCount || rv.length;
  const desc = p.description || 'Tidak ada deskripsi.';
  const long = desc.length > 220 || desc.split('\n').length > 5;
  const links = [p.affiliateUrl && { k: 'shp', label: 'Shopee', href: p.affiliateUrl }, p.tiktokUrl && { k: 'tt', label: 'TikTok', href: p.tiktokUrl }]
    .filter(Boolean) as { k: string; label: string; href: string }[];
  const mk = (short: boolean) => links.map((l) => (
    <a key={l.k} className={`btn-buy ${l.k}`} onClick={() => lazyTrack.click(p.id, l.k === 'tt' ? 'tiktok' : 'shopee')} href={l.href} target="_blank" rel="noopener noreferrer sponsored">
      {l.k === 'shp' ? <ShopeeIcon /> : <TikTokIcon />}
      <span>{links.length === 1 || !short ? `Cek Diskon di ${l.k === 'tt' ? 'TikTok' : 'Shopee'}` : `Diskon ${l.label}`}</span>
    </a>
  ));
  const imgs = (p.images && p.images.filter(Boolean).length ? p.images.filter(Boolean) : p.image ? [p.image] : []).slice(0, 5);
  const go = (i: number) => { const el = trackRef.current; if (el) el.scrollTo({ left: Math.max(0, Math.min(imgs.length - 1, i)) * el.clientWidth, behavior: 'smooth' }); };
  const shownRv = allRv ? rv : rv.slice(0, 3);

  return (
    <div className="dp">
      <div className="wrap crumb">
        <Link href="/">Beranda</Link>{cat && <> › <Link href={`/?cat=${cat.id}`}>{cat.name}</Link></>} › <span>{p.name}</span>
      </div>
      <div className="wrap detail">
        <div className="d-gal">
          <div className="d-img">
            <div className="g-track" ref={trackRef} onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1)))}>
              {imgs.map((src, i) => (
                <div className="g-slide" key={src + i}>
                  <Img src={src} alt={`${p.name} – foto ${i + 1}`} w={1024} sizes="(max-width:800px) 100vw, 480px" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} />
                </div>
              ))}
            </div>
            {d > 0 && <span className="disc big"><b>{d}%</b><i>OFF</i></span>}
            {p.isDemo && <span className="dm">DEMO</span>}
            {imgs.length > 1 && <span className="g-count">{idx + 1}/{imgs.length}</span>}
            {imgs.length > 1 && <><button type="button" className="g-nav prev" onClick={() => go(idx - 1)} aria-label="Foto sebelumnya">‹</button><button type="button" className="g-nav next" onClick={() => go(idx + 1)} aria-label="Foto berikutnya">›</button></>}
          </div>
          {imgs.length > 1 && (
            <div className="g-thumbs">
              {imgs.map((src, i) => <button type="button" key={src + i} className={i === idx ? 'on' : ''} onClick={() => go(i)} aria-label={`Foto ${i + 1}`}><Img src={src} alt="" w={160} sizes="84px" /></button>)}
            </div>
          )}
        </div>
        <div className="d-info">
          <div className="pbar">
            <div className="pnow">{rupiah(now)}</div>
            {d > 0 && <><s>{rupiah(p.price)}</s><span className="pdisc">-{d}%</span></>}
          </div>
          <div className="box">
            <h1 className="d-title">{p.isMall && <span className="mall">Mall</span>}{p.name}</h1>
            {(avg > 0 || sold > 0) && (
              <div className="rate-row">
                {avg > 0 && <span><b>{avg.toFixed(1)}</b> <Stars value={avg} /></span>}
                {rc > 0 && <span><b>{formatCount(rc)}</b> Penilaian</span>}
                {sold > 0 && <span><b>{formatCount(sold)}</b> Terjual</span>}
              </div>
            )}
            {cat && <Link href={`/?cat=${cat.id}`} className="tag">{cat.icon} {cat.name}</Link>}
            <ul className="trust">
              <li>🛡️ Pembayaran &amp; pengiriman diproses langsung oleh platform pilihanmu</li>
              <li>🔗 Link resmi menuju halaman produk{links.length > 1 ? ' di Shopee atau TikTok' : ''}</li>
            </ul>
            <div className="choose"><h4>Pilih tempat beli</h4>{mk(false)}</div>
          </div>
          <div className="box">
            <h3>Deskripsi Produk</h3>
            <p className={'desc' + (long && !openDesc ? ' clamp' : '')}>{desc}</p>
            {long && <button type="button" className="more-btn" onClick={() => setOpenDesc((v) => !v)} aria-expanded={openDesc}>{openDesc ? 'Tutup ▴' : 'Lihat Selengkapnya ▾'}</button>}
          </div>
          {(rv.length > 0 || avg > 0) && (
            <div className="box">
              <h3>Ulasan Terbaru</h3>
              {avg > 0 && <div className="rv-sum"><b>{avg.toFixed(1)}</b><div><Stars value={avg} size="1.1rem" /><br /><small className="muted">{rc > 0 ? `${formatCount(rc)} penilaian` : 'dari 5'}</small></div></div>}
              {shownRv.map((r, i) => (
                <div className="rv" key={i}>
                  <span className="av">{r.name.charAt(0).toUpperCase()}</span>
                  <div><b>{r.name}</b><br /><Stars value={r.rating} size=".8rem" /><p>{r.text}</p></div>
                </div>
              ))}
              {rv.length > 3 && <button type="button" className="more-btn" onClick={() => setAllRv((v) => !v)}>{allRv ? 'Tutup ▴' : `Lihat Semua Ulasan (${rv.length}) ▾`}</button>}
            </div>
          )}
        </div>
      </div>
      {rel.length > 0 && (
        <section className="wrap sec">
          <div className="row"><h2>Rekomendasi Untukmu</h2><Link href="/rekomendasi" className="more">Lihat semua →</Link></div>
          <div className="grid">{rel.map((x) => <ProductCard key={x.id} p={x} />)}</div>
        </section>
      )}
      <div className="buybar">
        <div className="pb"><b className="pb-now">{rupiah(now)}</b>{d > 0 && <s className="pb-old">{rupiah(p.price)}</s>}</div>
        <div className="btns">{mk(true)}</div>
      </div>
    </div>
  );
}
