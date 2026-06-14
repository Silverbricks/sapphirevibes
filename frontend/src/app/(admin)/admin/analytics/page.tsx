'use client';

import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/admin.service';

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminService.getAnalytics(),
    retry: false,
  });

  const cards = [
    { label: 'Revenue (30d)',     value: stats ? `$${Number(stats.revenue30d ?? 0).toFixed(0)}` : '—', sub: 'AUD, GST inclusive' },
    { label: 'Orders (30d)',      value: stats?.orders30d ?? '—',   sub: 'Total placed' },
    { label: 'Avg. Order Value',  value: stats ? `$${Number(stats.avgOrderValue ?? 0).toFixed(2)}` : '—', sub: 'Last 30 days' },
    { label: 'New Customers',     value: stats?.newCustomers30d ?? '—', sub: 'Last 30 days' },
    { label: 'Conversion Rate',   value: stats ? `${Number(stats.conversionRate ?? 0).toFixed(1)}%` : '—', sub: 'Sessions → Orders' },
    { label: 'Active Subs',       value: stats?.activeSubscriptions ?? '—', sub: 'Recurring plans' },
  ];

  return (
    <div style={{ padding: '32px 36px' }}>
      <div className="mb-8">
        <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)' }}>Analytics</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)', marginTop: 4 }}>Platform performance overview</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)' }}>Loading analytics…</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {cards.map(({ label, value, sub }) => (
              <div key={label} style={{ padding: 20, border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                <p style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: '1.8rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, color: 'var(--cream)', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--cream-dim)', marginTop: 6 }}>{sub}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: 24, border: '1px solid var(--line)', background: 'var(--ink-soft)', color: 'var(--cream-dim)', fontSize: '0.84rem' }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Full analytics</p>
            Connect Google Analytics (GA4) with ID <code style={{ color: 'var(--cream)' }}>NEXT_PUBLIC_GA_ID</code> for session-level data, funnels, and attribution. Replace the placeholder value in <code style={{ color: 'var(--cream)' }}>.env.local</code> to activate.
          </div>
        </>
      )}
    </div>
  );
}
