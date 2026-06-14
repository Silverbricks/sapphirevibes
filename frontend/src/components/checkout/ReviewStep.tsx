'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { ordersService } from '@/services/orders.service';
import toast from 'react-hot-toast';
import type { CheckoutAddress } from './CheckoutClient';

interface Props {
  address: CheckoutAddress;
  paymentIntentId: string | null;
  onBack: () => void;
}

export function ReviewStep({ address, paymentIntentId, onBack }: Props) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 150 ? 0 : 12.95;
  const total = subtotal + shipping;

  async function placeOrder() {
    if (items.length === 0) { toast('Your cart is empty.'); return; }
    if (!paymentIntentId) { toast('Payment not completed — please go back.'); return; }
    setLoading(true);
    try {
      const order = await ordersService.create(address, paymentIntentId);
      clearCart();
      toast('Order placed successfully!');
      router.push(`/order-confirmation/${order.id}`);
    } catch (err: any) {
      toast(err?.response?.data?.message ?? 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium mb-8" style={{ color: 'var(--cream)' }}>Review & Place Order</h2>

      {/* Delivery address */}
      <Section title="Delivery to">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--cream-dim)' }}>
          {address.fullName}<br />
          {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
          {address.suburb} {address.state} {address.postcode}<br />
          {address.country} · {address.phone}
        </p>
      </Section>

      {/* Items */}
      <Section title="Items">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span style={{ color: 'var(--cream)' }}>
                {item.name} {item.variantName ? `(${item.variantName})` : ''} × {item.quantity}
              </span>
              <span style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>
                {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : '—'}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Total */}
      <Section title="Order total">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: 'var(--cream-dim)' }}>Subtotal</span><span style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--cream-dim)' }}>Shipping</span><span style={{ color: shipping === 0 ? 'var(--gold)' : 'var(--cream)', fontFamily: 'Jost' }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-semibold pt-2" style={{ borderTop: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--cream)' }}>Total (AUD)</span>
            <span style={{ color: 'var(--gold-bright)', fontFamily: 'Jost', fontSize: '1.1rem' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </Section>

      <p className="text-xs mb-6" style={{ color: 'var(--cream-dim)' }}>
        By placing your order you agree to our{' '}
        <a href="/terms" style={{ color: 'var(--gold)' }}>Terms of Service</a> and confirm pricing includes GST.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 text-xs tracking-widest uppercase transition-all duration-300"
          style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.22em' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)'; }}
        >
          ← Back
        </button>
        <button
          onClick={placeOrder}
          disabled={loading}
          className="flex-[2] py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-60"
          style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.22em' }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
        >
          {loading ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--line)' }}>
      <h3 className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>{title}</h3>
      {children}
    </div>
  );
}
