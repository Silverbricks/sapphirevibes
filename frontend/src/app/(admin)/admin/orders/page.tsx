'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/admin.service';
import type { Metadata } from 'next';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'var(--cream-dim)',
  CONFIRMED: '#60a5fa',
  PROCESSING: '#fbbf24',
  PACKED: '#a78bfa',
  SHIPPED: '#34d399',
  DELIVERED: 'var(--gold)',
  RETURNED: '#f87171',
  CANCELLED: '#f87171',
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status],
    queryFn: () => adminService.getOrders({ page, limit: 20, status: status || undefined }),
    retry: false,
  });

  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ padding: '32px 36px' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)' }}>Orders</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)', marginTop: 4 }}>{total} total orders</p>
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: '8px 14px', background: 'var(--ink)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.82rem', cursor: 'pointer' }}
        >
          <option value="">All statuses</option>
          {['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','DELIVERED','RETURNED','CANCELLED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)' }}>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--cream-dim)', border: '1px solid var(--line)' }}>No orders found</div>
      ) : (
        <>
          <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                  {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--cream-dim)', fontWeight: 500, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--cream)', fontWeight: 500 }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{o.user?.firstName} {o.user?.lastName}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{new Date(o.createdAt).toLocaleDateString('en-AU')}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{o.items?.length ?? 0}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--gold-bright)', fontFamily: 'Jost' }}>${Number(o.total).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: STATUS_COLORS[o.status] ?? 'var(--cream-dim)' }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/order-confirmation/${o.id}`} style={{ fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.12em' }}>View →</Link>
                    </td>
                  </tr>
                ))}
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
