import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SubscriptionPageClient } from '@/components/account/SubscriptionPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Subscription — SapphireVibes' };

export default function SubscriptionPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <SubscriptionPageClient />
      </main>
      <SiteFooter />
    </>
  );
}
