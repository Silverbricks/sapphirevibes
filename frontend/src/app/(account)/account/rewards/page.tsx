import type { Metadata } from 'next';
import { RewardsClient } from '@/components/account/RewardsClient';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = { title: 'Rewards — SapphireVibes' };

export default function RewardsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <RewardsClient />
      </main>
      <SiteFooter />
    </>
  );
}
