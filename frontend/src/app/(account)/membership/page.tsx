import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MembershipPageClient } from '@/components/account/MembershipPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Membership — SapphireVibes' };

export default function MembershipPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <MembershipPageClient />
      </main>
      <SiteFooter />
    </>
  );
}
