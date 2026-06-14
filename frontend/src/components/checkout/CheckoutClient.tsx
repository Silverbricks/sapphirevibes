'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { AddressStep } from './AddressStep';
import { PaymentStep } from './PaymentStep';
import { ReviewStep } from './ReviewStep';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, ease } from '@/lib/motion';

export type CheckoutAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
};

const STEPS = [
  { label: 'Delivery',  sublabel: 'Shipping address' },
  { label: 'Payment',   sublabel: 'Secure checkout' },
  { label: 'Review',    sublabel: 'Confirm order' },
] as const;

type Step = 0 | 1 | 2;

export function CheckoutClient() {
  const { items, subtotal } = useCartStore();
  const [step, setStep]     = useState<Step>(0);
  const [address, setAddress]             = useState<CheckoutAddress | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const shipping = subtotal >= 150 ? 0 : 12.95;
  const total    = subtotal + shipping;

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 py-12">

        {/* ── Gold progress tracker ─────────────── */}
        <div className="mb-12 max-w-[480px] mx-auto">
          <div className="flex items-start">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-start flex-1">
                {/* Step node + label */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <motion.div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500"
                    style={{
                      background: i < step ? 'var(--gold)' : i === step ? 'transparent' : 'transparent',
                      border: i <= step ? '2px solid var(--gold)' : '1.5px solid var(--line)',
                      color: i < step ? 'var(--ink)' : i === step ? 'var(--gold)' : 'var(--cream-dim)',
                      fontFamily: 'Jost',
                    }}
                  >
                    {i < step ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </motion.div>
                  <div className="text-center">
                    <p className="text-[0.68rem] tracking-[0.14em] uppercase font-medium" style={{ color: i <= step ? 'var(--cream)' : 'var(--cream-dim)', letterSpacing: '0.14em' }}>
                      {s.label}
                    </p>
                    <p className="text-[0.58rem] hidden sm:block" style={{ color: 'var(--cream-dim)' }}>{s.sublabel}</p>
                  </div>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mt-[18px] mx-3">
                    <div className="h-px relative" style={{ background: 'var(--line)' }}>
                      <motion.div
                        className="absolute inset-y-0 left-0 h-px"
                        style={{ background: 'linear-gradient(90deg, var(--gold), var(--soft-gold))' }}
                        initial={{ width: 0 }}
                        animate={{ width: i < step ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              {step === 0 && (
                <AddressStep
                  initial={address}
                  onNext={(addr) => { setAddress(addr); setStep(1); }}
                />
              )}
              {step === 1 && address && (
                <PaymentStep
                  total={total}
                  onBack={() => setStep(0)}
                  onNext={(piId) => { setPaymentIntentId(piId); setStep(2); }}
                />
              )}
              {step === 2 && address && (
                <ReviewStep
                  address={address}
                  paymentIntentId={paymentIntentId}
                  onBack={() => setStep(1)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sticky order summary */}
          <div>
            <div
              className="sticky"
              style={{ top: 100, border: '1px solid var(--line)', background: 'var(--ink-soft)' }}
            >
              <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
                <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--cream)' }}>Order Summary</h3>
              </div>

              <div className="px-6 py-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div
                      className="w-12 h-12 shrink-0 overflow-hidden"
                      style={{ background: 'var(--panel)', border: '1px solid var(--line)' }}
                    >
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,var(--gold),var(--muted-gold))', opacity: 0.4 }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug line-clamp-1" style={{ color: 'var(--cream)' }}>{item.name}</p>
                      {item.variantName && <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>{item.variantName}</p>}
                      <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm shrink-0" style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>
                      {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : '—'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--cream-dim)' }}>Subtotal</span>
                    <span style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--cream-dim)' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--cream)', fontFamily: 'Jost' }}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 mt-2" style={{ borderTop: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--cream)' }}>Total (AUD)</span>
                    <span style={{ color: 'var(--gold-bright)', fontFamily: 'Jost', fontSize: '1.1rem' }}>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs pt-1" style={{ color: 'var(--cream-dim)' }}>GST included · Prices in AUD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
