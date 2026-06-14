import type { Metadata } from 'next';
import { InventoryDashboardClient } from '@/components/admin/InventoryDashboardClient';

export const metadata: Metadata = { title: 'Inventory — SapphireVibes Admin' };

export default function AdminInventoryPage() {
  return <InventoryDashboardClient />;
}
