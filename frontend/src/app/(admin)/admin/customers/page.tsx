'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/admin.service';

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: () => adminService.getCustomers({ page, limit: 20, search: search || undefined }),
    retry: false,
  });

  const customers = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const TIER_COLORS: Record<string, string> = {
    free: '#9ca3af', silver: '#d1d5db', gold: 'var(--gold)', vip: 'var(--gold-bright)',
  };

  return (
    <div style={{ padding: '32px 36px' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)' }}>Customers</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)', marginTop: 4 }}>{total} registered accounts</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '8px 14px', background: 'var(--ink)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.82rem', width: 260, outline: 'none' }}
        />
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)' }}>Loading customers…</div>
      ) : customers.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)', border: '1px solid var(--line)' }}>No customers found</div>
      ) : (
        <>
          <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                  {['Name', 'Email', 'Joined', 'Orders', 'Total Spend', 'Tier'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--cream-dim)', fontWeight: 500, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => {
                  const tier = c.membership?.tier?.slug ?? 'free';
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--cream)', fontWeight: 500 }}>{c.firstName} {c.lastName}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{c.email}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{new Date(c.createdAt).toLocaleDateString('en-AU')}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{c._count?.orders ?? 0}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--gold-bright)', fontFamily: 'Jost' }}>${Number(c.membership?.annualSpendAud ?? 0).toFixed(2)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TIER_COLORS[tier] }}>{c.membership?.tier?.name ?? 'Free'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex gap-3 mt-4 justify-end">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: '0.8rem' }}>← Prev</button>
              <span style={{ padding: '6px 14px', color: 'var(--cream-dim)', fontSize: '0.8rem' }}>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: '0.8rem' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
