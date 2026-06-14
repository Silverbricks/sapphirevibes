import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Checkout — SapphireVibes' };

export default function CheckoutPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <CheckoutClient />
      </main>
    </>
  );
}
