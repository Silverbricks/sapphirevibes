import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { OrdersListClient } from '@/components/account/OrdersListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Orders — SapphireVibes' };

export default function OrdersPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <div className="max-w-[900px] mx-auto px-8 py-14">
          <h1 className="font-serif text-3xl font-medium mb-10" style={{ color: 'var(--cream)' }}>My Orders</h1>
          <OrdersListClient />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
