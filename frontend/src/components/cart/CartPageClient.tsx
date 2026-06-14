'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 12.95;

export function CartPageClient() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCartStore();
  const [coupon, setCoupon]               = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount]           = useState(0);

  const shipping   = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discounted = subtotal - discount;
  const gst        = discounted / 11; // extract 10% GST from GST-inclusive price
  const total      = discounted + shipping;

  async function applyCoupon() {
    if (!coupon.trim()) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setAppliedCoupon(coupon.toUpperCase());
        toast(data.label);
      } else {
        toast(data.message ?? 'Invalid or expired coupon code');
      }
    } catch {
      toast('Could not validate coupon — try again');
    }
    setCoupon('');
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <div className="text-5xl mb-6">🛒</div>
        <h1 className="font-serif text-3xl font-medium mb-4" style={{ color: 'var(--cream)' }}>Your cart is empty</h1>
        <p className="mb-8 text-sm" style={{ color: 'var(--cream-dim)' }}>Browse our collections to find the perfect piece.</p>
        <Link href="/products" className="btn-gold">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-serif text-2xl md:text-3xl font-medium mb-8 md:mb-12" style={{ color: 'var(--cream)' }}>
        Your Cart{' '}
        <span className="text-base font-sans" style={{ color: 'var(--cream-dim)' }}>
          ({items.length} item{items.length !== 1 ? 's' : ''})
        </span>
      </h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        {/* ── Item list ── */}
        <div>
          {/* Header — desktop only */}
          <div
            className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_80px] items-center gap-4 pb-3 mb-2 text-[0.68rem] tracking-widest uppercase"
            style={{ color: 'var(--cream-dim)', borderBottom: '1px solid var(--line)', letterSpacing: '0.16em' }}
          >
            <span>Product</span>
            <span className="text-right">Price</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Total</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_80px_100px_80px] items-start sm:items-center gap-4 py-5"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              {/* Product info */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div
                  className="w-16 h-16 flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                  style={{ border: '1px solid var(--line)', background: 'var(--panel)' }}
                >
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-8 h-8" style={{ background: 'linear-gradient(135deg,var(--gold-bright),var(--gold))', borderRadius: '40%' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight mb-0.5 line-clamp-2" style={{ color: 'var(--cream)' }}>{item.name}</p>
                  {item.variantName && <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>{item.variantName}</p>}
                  {/* Mobile price */}
                  <p className="sm:hidden text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>
                    {item.price > 0 ? `$${item.price.toFixed(2)} each` : '—'}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[0.7rem] mt-1.5 transition-colors duration-200 hover:text-red-400"
                    style={{ color: 'var(--cream-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Price — desktop only */}
              <span className="hidden sm:block text-right text-sm" style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>
                {item.price > 0 ? `$${item.price.toFixed(2)}` : '—'}
              </span>

              {/* Qty stepper */}
              <div className="flex items-center self-start sm:self-auto sm:justify-center" style={{ border: '1px solid var(--line)' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-lg transition-colors duration-200 hover:text-[var(--gold)]"
                  style={{ background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer' }}
                  aria-label="Decrease quantity"
                >−</button>
                <span className="w-7 text-center text-sm" style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-lg transition-colors duration-200 hover:text-[var(--gold)]"
                  style={{ background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer' }}
                  aria-label="Increase quantity"
                >+</button>
              </div>

              {/* Line total */}
              <span className="hidden sm:block text-right text-sm font-medium" style={{ color: 'var(--gold-bright)', fontFamily: 'Jost' }}>
                {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : '—'}
              </span>
            </div>
          ))}

          <button
            onClick={() => { clearCart(); toast('Cart cleared'); }}
            className="mt-4 text-[0.7rem] tracking-widest uppercase transition-colors duration-200 hover:text-red-400"
            style={{ color: 'var(--cream-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.2em' }}
          >
            Clear cart
          </button>
        </div>

        {/* ── Summary panel ── */}
        <div>
          <div style={{ border: '1px solid var(--line)', padding: '24px', background: 'var(--ink-soft)', position: 'sticky', top: 100 }}>
            <h2 className="font-serif text-xl font-medium mb-5" style={{ color: 'var(--cream)' }}>Order Summary</h2>

            <div className="space-y-3 mb-5">
              <SummaryRow label="Subtotal"                    value={`$${subtotal.toFixed(2)}`} />
              {discount > 0 && <SummaryRow label={`Coupon (${appliedCoupon})`} value={`−$${discount.toFixed(2)}`} highlight />}
              <SummaryRow
                label={shipping === 0 ? 'Shipping (Free!)' : 'Shipping'}
                value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              />
              <SummaryRow label="GST included" value={`$${gst.toFixed(2)}`} dim />
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <SummaryRow label="Total (AUD)" value={`$${total.toFixed(2)}`} large />
              </div>
            </div>

            {/* Free-shipping progress */}
            {shipping > 0 && (
              <div className="mb-5">
                <p className="text-xs mb-2" style={{ color: 'var(--cream-dim)' }}>
                  Add <b style={{ color: 'var(--gold)' }}>${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</b> for free shipping
                </p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`, background: 'var(--gold)' }}
                  />
                </div>
              </div>
            )}

            {/* Coupon */}
            {!appliedCoupon && (
              <div className="flex mb-5" style={{ border: '1px solid var(--line)' }}>
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent min-w-0"
                  style={{ color: 'var(--cream)' }}
                  aria-label="Coupon code"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 text-[0.66rem] tracking-widest uppercase transition-colors duration-200 hover:text-[var(--gold-bright)] flex-shrink-0"
                  style={{ background: 'transparent', border: 'none', borderLeft: '1px solid var(--line)', color: 'var(--gold)', cursor: 'pointer', letterSpacing: '0.18em' }}
                >
                  Apply
                </button>
              </div>
            )}

            <Link
              href="/checkout"
              className="btn-gold block text-center w-full"
              style={{ letterSpacing: '0.22em' }}
            >
              Proceed to checkout
            </Link>

            <p className="mt-4 text-xs text-center" style={{ color: 'var(--cream-dim)' }}>
              Secure checkout · Afterpay · Zip · Apple Pay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight, dim, large }: { label: string; value: string; highlight?: boolean; dim?: boolean; large?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className={`${large ? 'font-medium text-sm' : 'text-sm'}`} style={{ color: dim ? 'var(--cream-dim)' : 'var(--cream)' }}>
        {label}
      </span>
      <span className={`${large ? 'font-semibold text-base' : 'text-sm'} flex-shrink-0`} style={{ color: highlight ? 'var(--gold)' : large ? 'var(--gold-bright)' : 'var(--cream)', fontFamily: 'Jost' }}>
        {value}
      </span>
    </div>
  );
}
