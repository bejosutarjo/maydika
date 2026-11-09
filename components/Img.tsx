import { optimize, srcSet } from '@/lib/util';
export default function Img({ src, alt, w = 640, sizes = '(max-width:600px) 50vw, 300px', ...rest }:
  { src: string; alt: string; w?: number; sizes?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={optimize(src, w)} srcSet={srcSet(src)} sizes={sizes} alt={alt} loading="lazy" decoding="async" {...rest} />;
}
