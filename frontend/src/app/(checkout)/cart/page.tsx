import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CartPageClient } from '@/components/cart/CartPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cart — SapphireVibes' };

export default function CartPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <CartPageClient />
      </main>
      <SiteFooter />
    </>
  );
}
