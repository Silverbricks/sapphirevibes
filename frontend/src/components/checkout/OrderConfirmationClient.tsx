'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getOrder(orderId),
    enabled: isAuthenticated && !!orderId,
  });

  return (
    <div className="max-w-[700px] mx-auto px-8 py-24 text-center">
      <div className="mb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
        >
          ✓
        </div>
        <h1 className="font-serif text-4xl font-medium mb-3" style={{ color: 'var(--cream)' }}>
          Order Confirmed
        </h1>
        {order && (
          <p className="text-lg" style={{ color: 'var(--cream-dim)' }}>
            Order{' '}
            <span style={{ color: 'var(--gold-bright)', fontFamily: 'Jost' }}>{order.orderNumber}</span>
          </p>
        )}
      </div>

      <div style={{ border: '1px solid var(--line)', padding: 32, background: 'var(--ink-soft)', textAlign: 'left', marginBottom: 36 }}>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[60, 80, 40].map((w, i) => (
              <div key={i} className="h-4 rounded" style={{ width: `${w}%`, background: 'var(--panel)' }} />
            ))}
          </div>
        ) : order ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>What's next</p>
              <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                You'll receive a confirmation email at <b style={{ color: 'var(--cream)' }}>{order.email}</b> with your order details and tracking information once dispatched.
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>Order summary</p>
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm py-1.5">
                  <span style={{ color: 'var(--cream)' }}>{item.productName} × {item.quantity}</span>
                  <span style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>${Number(item.lineTotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }} className="flex justify-between font-semibold">
              <span style={{ color: 'var(--cream)' }}>Total paid</span>
              <span style={{ color: 'var(--gold-bright)', fontFamily: 'Jost', fontSize: '1.1rem' }}>${Number(order.total).toFixed(2)} AUD</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-center" style={{ color: 'var(--cream-dim)' }}>
            Your order has been placed. Check your email for confirmation.
          </p>
        )}
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        {isAuthenticated && (
          <Link
            href="/account/orders"
            className="btn-ghost text-xs tracking-widest uppercase px-8 py-4"
            style={{ letterSpacing: '0.22em' }}
          >
            Track order
          </Link>
        )}
        <Link
          href="/products"
          className="btn-gold text-xs tracking-widest uppercase px-8 py-4"
          style={{ letterSpacing: '0.22em', textDecoration: 'none' }}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
