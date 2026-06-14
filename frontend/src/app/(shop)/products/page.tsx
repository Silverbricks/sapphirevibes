import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ProductListingClient } from '@/components/product/ProductListingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products — SapphireVibes',
  description: 'Browse our full collection of home décor — wall art, mirrors, statues, planters, vases and more.',
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <div className="container-page py-14">
          <div className="mb-10">
            <span className="eyebrow block mb-3">Home décor · Australia</span>
            <h1 className="font-serif font-medium" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--cream)' }}>
              {searchParams.collection
                ? searchParams.collection.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                : searchParams.category
                ? searchParams.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                : 'All Products'}
            </h1>
          </div>
          <ProductListingClient initialQuery={searchParams} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
