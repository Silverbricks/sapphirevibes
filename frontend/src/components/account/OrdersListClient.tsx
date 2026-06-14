'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#9ca3af', CONFIRMED: '#60a5fa', PROCESSING: '#fbbf24',
  PACKED: '#a78bfa', SHIPPED: '#34d399', DELIVERED: 'var(--gold)',
  RETURNED: '#f87171', CANCELLED: '#f87171', REFUNDED: '#f87171',
};

export function OrdersListClient() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: () => ordersService.getMyOrders(page),
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line)' }} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
        <p className="font-serif text-2xl mb-3" style={{ color: 'var(--cream)' }}>No orders yet</p>
        <Link href="/products" className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>Start shopping →</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 mb-8">
        {orders.map((order: any) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block transition-all duration-300"
            style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', textDecoration: 'none' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,164,92,.45)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--line)')}
          >
            <div className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--cream)' }}>{order.orderNumber}</p>
                <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>
                  {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold mb-1" style={{ color: 'var(--gold-bright)', fontFamily: 'Jost' }}>
                  ${Number(order.total).toFixed(2)} AUD
                </p>
                <span
                  className="text-[0.6rem] tracking-wider uppercase px-2 py-0.5"
                  style={{ border: `1px solid ${STATUS_COLORS[order.status] ?? 'var(--line)'}`, color: STATUS_COLORS[order.status] ?? 'var(--cream-dim)', letterSpacing: '0.14em' }}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className="w-9 h-9 text-sm transition-all duration-300"
              style={{ border: '1px solid var(--line)', background: pg === page ? 'var(--gold)' : 'transparent', color: pg === page ? 'var(--ink)' : 'var(--cream-dim)', cursor: 'pointer', fontFamily: 'Jost' }}
            >
              {pg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
