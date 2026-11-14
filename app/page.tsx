import HomeClient from '@/components/HomeClient';
import { fetchBanners, fetchProducts, slim, slimBanner } from '@/lib/server';

export const revalidate = 60;

export default async function Home() {
  const [products, banners] = await Promise.all([fetchProducts(), fetchBanners()]);
  return <HomeClient products={products.map(slim)} banners={banners.map(slimBanner)} />;
}
