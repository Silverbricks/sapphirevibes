import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard — SapphireVibes' };

export default function AdminPage() {
  return <AdminDashboardClient />;
}
