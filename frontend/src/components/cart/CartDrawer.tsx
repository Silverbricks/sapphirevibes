'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { slideInRight, STD, ease } from '@/lib/motion';

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const { items, subtotal, itemCount, removeItem, updateQuantity } = useCartStore();
  const shipping = subtotal >= 150 ? 0 : 12.95;
  const freeShippingRemaining = Math.max(0, 150 - subtotal);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: STD, ease }}
            onClick={closeCart}
            style={{ zIndex: 99 }}
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[100] flex flex-col"
            style={{
              width: 'min(420px, 100vw)',
              background: 'var(--charcoal)',
              borderLeft: '1px solid var(--line)',
              boxShadow: '-40px 0 80px rgba(0,0,0,0.5)',
            }}
            variants={slideInRight}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.38, ease }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-lg font-medium" style={{ color: 'var(--cream)' }}>
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'Jost' }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
                style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Free shipping bar */}
            {itemCount > 0 && (
              <div className="px-6 py-3 shrink-0" style={{ background: 'var(--luxury-surface)', borderBottom: '1px solid var(--line)' }}>
                {freeShippingRemaining > 0 ? (
                  <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>
                    Spend{' '}
                    <span style={{ color: 'var(--gold)' }}>${freeShippingRemaining.toFixed(2)}</span>
                    {' '}more for free shipping
                  </p>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--success)' }}>
                    ✓ You qualify for free shipping
                  </p>
                )}
                <div className="h-0.5 mt-2 rounded-full" style={{ background: 'var(--line)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / 150) * 100)}%`,
                      background: 'linear-gradient(90deg, var(--gold), var(--gold-bright))',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--ink-soft)', border: '1px solid var(--line)' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="1.3">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-serif text-lg mb-1" style={{ color: 'var(--cream)' }}>Your cart is empty</p>
                    <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>Discover our curated collection</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="btn-gold text-[0.7rem] px-6 py-3 tracking-widest"
                  >
                    Shop now
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Thumbnail */}
                      <div
                        className="w-[68px] h-[68px] shrink-0 overflow-hidden"
                        style={{ background: 'var(--panel)', border: '1px solid var(--line)' }}
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={68}
                            height={68}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 opacity-20" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="1.2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug ?? ''}`}
                          onClick={closeCart}
                          className="text-sm font-medium line-clamp-1 hover:text-[var(--gold)] transition-colors duration-200"
                          style={{ color: 'var(--cream)' }}
                        >
                          {item.name}
                        </Link>
                        {item.variantName && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>{item.variantName}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          {/* Qty stepper */}
                          <div
                            className="flex items-center"
                            style={{ border: '1px solid var(--line)', height: 30 }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-full flex items-center justify-center text-sm transition-colors duration-200"
                              style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer' }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)')}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)')}
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs" style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-full flex items-center justify-center text-sm transition-colors duration-200"
                              style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer' }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)')}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)')}
                            >
                              +
                            </button>
                          </div>

                          {/* Price + remove */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
                              {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : '—'}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label="Remove item"
                              className="transition-colors duration-200"
                              style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer' }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--error)')}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)')}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="shrink-0 px-6 py-5" style={{ borderTop: '1px solid var(--line)', background: 'var(--luxury-surface)' }}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>Subtotal</span>
                  <span className="font-medium" style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>Shipping</span>
                  <span className="text-sm" style={{ color: shipping === 0 ? 'var(--success)' : 'var(--cream-dim)', fontFamily: 'Jost' }}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex-1 py-3 text-xs tracking-widest uppercase text-center transition-all duration-300"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--line)',
                      color: 'var(--cream-dim)',
                      fontFamily: 'Jost',
                      letterSpacing: '0.2em',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-dim)'; }}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex-[2] py-3 text-xs tracking-widest uppercase text-center font-semibold transition-all duration-300 hover:brightness-110"
                    style={{
                      background: 'var(--gold)',
                      color: 'var(--ink)',
                      fontFamily: 'Jost',
                      letterSpacing: '0.2em',
                    }}
                  >
                    Checkout →
                  </Link>
                </div>
                <p className="text-center text-xs mt-3" style={{ color: 'var(--cream-dim)' }}>
                  GST inclusive · Afterpay available
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
