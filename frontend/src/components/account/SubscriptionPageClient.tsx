'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsService } from '@/services/subscriptions.service';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function SubscriptionPageClient() {
  const qc = useQueryClient();
  const [showPauseModal, setShowPauseModal] = useState(false);

  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: subscriptionsService.getPlans });
  const { data: sub } = useQuery({ queryKey: ['my-subscription'], queryFn: subscriptionsService.getMy });

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => subscriptionsService.subscribe(planId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-subscription'] }); toast('Subscription activated!'); },
    onError: (err: any) => toast(err?.response?.data?.message ?? 'Failed to subscribe'),
  });

  const pauseMutation = useMutation({
    mutationFn: (reason: string) => subscriptionsService.pause(reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-subscription'] }); toast('Subscription paused'); setShowPauseModal(false); },
    onError: () => toast('Could not pause subscription'),
  });

  const resumeMutation = useMutation({
    mutationFn: subscriptionsService.resume,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-subscription'] }); toast('Subscription resumed'); },
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionsService.cancel,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-subscription'] }); toast('Subscription will cancel at end of period'); },
  });

  const hasActiveSub = sub?.status === 'ACTIVE';
  const isPaused = sub?.status === 'PAUSED';

  return (
    <div className="max-w-[900px] mx-auto px-8 py-14">
      <div className="mb-10">
        <span className="eyebrow block mb-3">Member Benefits</span>
        <h1 className="font-serif font-medium" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--cream)' }}>Subscription Plans</h1>
      </div>

      {/* Current subscription status */}
      {sub && (
        <div className="mb-10 p-6" style={{ border: '1px solid var(--gold)', background: 'rgba(200,164,92,.06)' }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>Current Plan</p>
              <h2 className="font-serif text-2xl font-medium mb-1" style={{ color: 'var(--cream)' }}>
                {sub.plan?.name} — ${Number(sub.plan?.price).toFixed(2)}/{sub.plan?.billingPeriod === 'MONTHLY' ? 'mo' : 'yr'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                Status: <span style={{ color: sub.status === 'ACTIVE' ? '#34d399' : sub.status === 'PAUSED' ? '#fbbf24' : 'var(--cream-dim)' }}>{sub.status}</span>
                {sub.currentPeriodEnd && ` · Renews ${new Date(sub.currentPeriodEnd).toLocaleDateString('en-AU')}`}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {hasActiveSub && !sub.cancelAtPeriodEnd && (
                <>
                  <button
                    onClick={() => setShowPauseModal(true)}
                    className="px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-300"
                    style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.18em' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)'; }}
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => cancelMutation.mutate()}
                    className="px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-300"
                    style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.18em' }}
                  >
                    Cancel
                  </button>
                </>
              )}
              {isPaused && (
                <button
                  onClick={() => resumeMutation.mutate()}
                  disabled={resumeMutation.isPending}
                  className="px-4 py-2.5 text-xs tracking-widest uppercase"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.18em' }}
                >
                  {resumeMutation.isPending ? 'Resuming…' : 'Resume'}
                </button>
              )}
              {sub.cancelAtPeriodEnd && (
                <p className="text-xs" style={{ color: '#fbbf24' }}>
                  Cancels {new Date(sub.currentPeriodEnd).toLocaleDateString('en-AU')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {(plans ?? []).map((plan: any) => {
          const isCurrentPlan = sub?.planId === plan.id && (hasActiveSub || isPaused);
          const isYearly = plan.billingPeriod === 'YEARLY';

          return (
            <div
              key={plan.id}
              className="relative p-7 transition-all duration-300"
              style={{ border: `1px solid ${isCurrentPlan ? 'var(--gold)' : 'var(--line)'}`, background: 'var(--ink-soft)' }}
            >
              {isYearly && (
                <span
                  className="absolute top-4 right-4 text-[0.6rem] font-semibold px-2 py-1 tracking-widest uppercase"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', letterSpacing: '0.18em' }}
                >
                  Best value
                </span>
              )}

              <h3 className="font-serif text-xl font-medium mb-1" style={{ color: 'var(--cream)' }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-semibold" style={{ color: 'var(--gold-bright)', fontFamily: 'Jost' }}>
                  ${Number(plan.price).toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                  /{isYearly ? 'year' : 'month'}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {[
                  `${plan.discountPercentage}% off all orders`,
                  plan.freeDelivery ? 'Free delivery on all orders' : null,
                  plan.exclusiveAccess ? 'Exclusive product access' : null,
                  plan.earlyFestivalDeals ? 'Early festival deals' : null,
                  isYearly ? 'Save 28% vs monthly' : 'Cancel anytime',
                ].filter(Boolean).map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm" style={{ color: 'var(--cream-dim)' }}>
                    <span style={{ color: 'var(--gold)' }}>✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrentPlan || subscribeMutation.isPending}
                onClick={() => !isCurrentPlan && subscribeMutation.mutate(plan.id)}
                className="w-full py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-60"
                style={{
                  background: isCurrentPlan ? 'transparent' : 'var(--gold)',
                  color: isCurrentPlan ? 'var(--gold)' : 'var(--ink)',
                  border: isCurrentPlan ? '1px solid var(--gold)' : 'none',
                  cursor: isCurrentPlan ? 'default' : 'pointer',
                  fontFamily: 'Jost',
                  letterSpacing: '0.18em',
                }}
                onMouseEnter={(e) => { if (!isCurrentPlan) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)'; }}
                onMouseLeave={(e) => { if (!isCurrentPlan) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
              >
                {isCurrentPlan ? 'Current plan' : subscribeMutation.isPending ? 'Subscribing…' : `Subscribe ${isYearly ? 'yearly' : 'monthly'}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pause modal */}
      {showPauseModal && (
        <PauseModal
          onConfirm={(reason) => pauseMutation.mutate(reason)}
          onCancel={() => setShowPauseModal(false)}
          loading={pauseMutation.isPending}
        />
      )}
    </div>
  );
}

function PauseModal({ onConfirm, onCancel, loading }: { onConfirm: (reason: string) => void; onCancel: () => void; loading: boolean }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,.7)' }}>
      <div className="w-full max-w-[400px] p-8" style={{ background: 'var(--ink-soft)', border: '1px solid var(--line)' }}>
        <h3 className="font-serif text-xl font-medium mb-3" style={{ color: 'var(--cream)' }}>Pause subscription?</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--cream-dim)' }}>Your subscription will pause and you won't be billed. Resume anytime.</p>
        <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>Reason (optional)</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Travelling, tight budget, etc."
          className="w-full px-4 py-3 text-sm outline-none mb-6"
          style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', fontFamily: 'Jost' }}
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 text-xs tracking-widest uppercase" style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.18em' }}>
            Keep active
          </button>
          <button onClick={() => onConfirm(reason)} disabled={loading} className="flex-1 py-3 text-xs tracking-widest uppercase" style={{ background: '#fbbf24', color: '#1a1a1a', border: 'none', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.18em' }}>
            {loading ? 'Pausing…' : 'Pause'}
          </button>
        </div>
      </div>
    </div>
  );
}
