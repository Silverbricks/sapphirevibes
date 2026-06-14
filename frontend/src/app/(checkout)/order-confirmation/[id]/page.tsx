import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { OrderConfirmationClient } from '@/components/checkout/OrderConfirmationClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order Confirmed — SapphireVibes' };

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <OrderConfirmationClient orderId={params.id} />
      </main>
      <SiteFooter />
    </>
  );
}
