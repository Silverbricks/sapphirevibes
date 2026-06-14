import type { Metadata } from 'next';
import { WishlistClient } from '@/components/account/WishlistClient';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = { title: 'Wishlist — SapphireVibes' };

export default function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <WishlistClient />
      </main>
      <SiteFooter />
    </>
  );
}
