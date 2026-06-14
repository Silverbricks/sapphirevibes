import { Topbar } from '@/components/layout/Topbar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AccountDashboardClient } from '@/components/account/AccountDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Account — SapphireVibes' };

export default function AccountPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <AccountDashboardClient />
      </main>
      <SiteFooter />
    </>
  );
}
