import type { Metadata } from 'next';
import { ReviewsModerationClient } from '@/components/admin/ReviewsModerationClient';

export const metadata: Metadata = { title: 'Reviews — SapphireVibes Admin' };

export default function AdminReviewsPage() {
  return <ReviewsModerationClient />;
}
