import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} — SapphireVibes`,
  };
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <ProductDetailClient slug={params.slug} />
      </main>
      <SiteFooter />
    </>
  );
}
