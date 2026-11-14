import { optimize, srcSet } from '@/lib/util';

// width/height diberikan agar browser memesan ruang sebelum gambar tiba (mencegah layout shift).
export default function Img({ src, alt, w = 640, ratio = 1, sizes = '(max-width:600px) 50vw, 300px', ...rest }:
  { src: string; alt: string; w?: number; ratio?: number; sizes?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={optimize(src, w)} srcSet={srcSet(src)} sizes={sizes} alt={alt} width={w} height={Math.round(w * ratio)} loading="lazy" decoding="async" {...rest} />;
}
