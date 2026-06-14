'use client';

import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/admin.service';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#34d399',
  PAUSED: '#fbbf24',
  CANCELLED: '#f87171',
  EXPIRED: 'var(--cream-dim)',
};

export default function AdminSubscriptionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => adminService.getSubscriptions(),
    retry: false,
  });

  const subscriptions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div style={{ padding: '32px 36px' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)' }}>Subscriptions</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)', marginTop: 4 }}>{total} total subscriptions</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)' }}>Loading subscriptions…</div>
      ) : subscriptions.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)', border: '1px solid var(--line)' }}>No active subscriptions</div>
      ) : (
        <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                {['Customer', 'Plan', 'Started', 'Next Billing', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--cream-dim)', fontWeight: 500, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--cream)', fontWeight: 500 }}>{s.user?.firstName} {s.user?.lastName}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{s.plan?.name ?? '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{s.startedAt ? new Date(s.startedAt).toLocaleDateString('en-AU') : '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{s.nextBillingAt ? new Date(s.nextBillingAt).toLocaleDateString('en-AU') : '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--gold-bright)', fontFamily: 'Jost' }}>${Number(s.plan?.priceAud ?? 0).toFixed(2)}/mo</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: STATUS_COLORS[s.status] ?? 'var(--cream-dim)' }}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
