'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import apiClient from '@/services/api.client';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  total: number;
  onBack: () => void;
  onNext: (paymentIntentId: string) => void;
}

function StripeForm({ onBack, onNext }: { onBack: () => void; onNext: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/order-confirmation` },
        redirect: 'if_required',
      });

      if (error) {
        toast(error.message ?? 'Payment failed');
      } else if (paymentIntent) {
        onNext(paymentIntent.id);
      }
    } catch {
      toast('Payment error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div style={{ border: '1px solid var(--line)', padding: 20, background: 'var(--ink-soft)' }}>
        <PaymentElement
          options={{
            layout: 'tabs',
            wallets: { applePay: 'auto', googlePay: 'auto' },
          }}
        />
      </div>

      <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>
        🔒 Secure payment via Stripe — PCI DSS compliant. Your card details never touch our servers.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 text-xs tracking-widest uppercase transition-all duration-300"
          style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontFamily: 'Inter', letterSpacing: '0.22em' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)'; }}
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading || !stripe}
          className="flex-[2] py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-60"
          style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Inter', letterSpacing: '0.22em' }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
        >
          {loading ? 'Processing…' : 'Review order →'}
        </button>
      </div>
    </form>
  );
}

export function PaymentStep({ total, onBack, onNext }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function initPayment() {
    if (clientSecret) return;
    setLoading(true);
    try {
      const { data } = await apiClient.post('/payments/intent', { amount: total });
      setClientSecret(data.data.client_secret);
    } catch {
      toast('Could not initialise payment. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // Kick off payment intent once on mount
  useEffect(() => { initPayment(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: 'var(--cream)' }}>Payment</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--cream-dim)' }}>All transactions are secured and encrypted.</p>

      {/* Accepted payment icons */}
      <div className="flex items-center gap-3 mb-7 flex-wrap">
        {/* Visa */}
        <div className="flex items-center justify-center px-3 py-1.5 text-[0.6rem] font-bold tracking-wider" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', color: '#1a1f71', minWidth: 48, minHeight: 28 }}>VISA</div>
        {/* Mastercard */}
        <div className="flex items-center justify-center px-2 py-1.5 gap-1" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', minWidth: 48, minHeight: 28 }}>
          <div className="w-4 h-4 rounded-full" style={{ background: '#EB001B', opacity: 0.9 }} />
          <div className="w-4 h-4 rounded-full -ml-2" style={{ background: '#F79E1B', opacity: 0.9 }} />
        </div>
        {/* Amex */}
        <div className="flex items-center justify-center px-3 py-1.5 text-[0.6rem] font-bold tracking-wider" style={{ border: '1px solid var(--line)', background: '#016FD0', color: '#fff', minWidth: 48, minHeight: 28 }}>AMEX</div>
        {/* Apple Pay */}
        <div className="flex items-center justify-center px-3 py-1.5 text-[0.65rem] font-medium" style={{ border: '1px solid var(--line)', background: '#000', color: '#fff', minWidth: 72, minHeight: 28, fontFamily: '-apple-system, sans-serif' }}>
          ⌘ Pay
        </div>
        {/* Google Pay */}
        <div className="flex items-center justify-center px-3 py-1.5 text-[0.65rem] font-medium" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', color: 'var(--cream-dim)', minWidth: 72, minHeight: 28 }}>
          G Pay
        </div>
        {/* Afterpay */}
        <div className="flex items-center justify-center px-3 py-1.5 text-[0.6rem] font-bold tracking-wider" style={{ border: '1px solid var(--line)', background: '#B2FCE4', color: '#000', minWidth: 72, minHeight: 28 }}>
          Afterpay
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center" style={{ color: 'var(--cream-dim)' }}>Initialising secure payment…</div>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#B49155', colorBackground: '#FFFFFF', colorText: '#111111', colorDanger: '#B04040', borderRadius: '0px', fontFamily: 'Inter', spacingUnit: '4px' } } }}>
          <StripeForm onBack={onBack} onNext={onNext} />
        </Elements>
      )}
    </div>
  );
}
