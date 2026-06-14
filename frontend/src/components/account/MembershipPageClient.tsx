'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipsService } from '@/services/memberships.service';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ease } from '@/lib/motion';

const TIER_ORDER = ['free', 'silver', 'gold', 'vip'];
const TIER_COLORS: Record<string, { primary: string; bg: string }> = {
  free:   { primary: '#9ca3af', bg: 'rgba(156,163,175,.08)' },
  silver: { primary: '#d1d5db', bg: 'rgba(209,213,219,.08)' },
  gold:   { primary: 'var(--gold)', bg: 'rgba(200,164,92,.08)' },
  vip:    { primary: 'var(--gold-bright)', bg: 'rgba(228,200,132,.08)' },
};

const MILESTONES = [
  { id: 'first-order',    label: 'First Order',       icon: '🛍️', points: 50 },
  { id: 'silver-member',  label: 'Silver Member',     icon: '🥈', points: 100 },
  { id: 'hundred-points', label: '100 Points Earned', icon: '⭐', points: 100 },
  { id: 'gold-member',    label: 'Gold Member',       icon: '🥇', points: 250 },
  { id: 'vip-member',     label: 'VIP Member',        icon: '👑', points: 500 },
];

function CircularProgress({ progress, color, size = 140 }: { progress: number; color: string; size?: number }) {
  const r       = (size - 16) / 2;
  const circ    = 2 * Math.PI * r;
  const pct     = Math.min(100, Math.max(0, progress));
  const offset  = circ - (pct / 100) * circ;
  const cx      = size / 2;
  const cy      = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden="true">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
      {/* Progress */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Center text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontFamily="Cormorant Garamond, serif" fontWeight="500" fill={color}>
        {Math.round(pct)}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="8" fontFamily="Jost, sans-serif" fill="var(--cream-dim)" letterSpacing="2">
        TO NEXT
      </text>
    </svg>
  );
}

export function MembershipPageClient() {
  const qc = useQueryClient();
  const [redeemPoints, setRedeemPoints] = useState('');

  const { data: tiers }      = useQuery({ queryKey: ['tiers'],          queryFn: membershipsService.getTiers });
  const { data: membership } = useQuery({ queryKey: ['my-membership'],  queryFn: membershipsService.getMy });
  const { data: rewardsData }= useQuery({ queryKey: ['my-rewards'],     queryFn: membershipsService.getRewardsBalance });
  const { data: history }    = useQuery({ queryKey: ['rewards-history'],queryFn: membershipsService.getRewardsHistory });

  const redeemMutation = useMutation({
    mutationFn: (pts: number) => membershipsService.redeemPoints(pts),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['my-rewards'] });
      qc.invalidateQueries({ queryKey: ['rewards-history'] });
      toast(`Redeemed ${redeemPoints} pts = $${data.dollarValue.toFixed(2)} discount`);
      setRedeemPoints('');
    },
    onError: (err: any) => toast(err?.response?.data?.message ?? 'Could not redeem'),
  });

  const currentTierSlug = membership?.tier?.slug ?? 'free';
  const tierColors      = TIER_COLORS[currentTierSlug] ?? TIER_COLORS.free;
  const balance         = rewardsData?.balance ?? 0;
  const progress        = Math.min(100, membership?.progressToNextTier ?? 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-8 py-14">
      <div className="mb-10">
        <span className="eyebrow block mb-3">Your Rewards</span>
        <h1 className="h1">Membership & Rewards</h1>
      </div>

      {/* Hero tier card */}
      {membership && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="p-8 mb-10"
          style={{ border: `1px solid ${tierColors.primary}`, background: tierColors.bg }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Circular progress ring */}
            {membership.nextTier ? (
              <CircularProgress progress={progress} color={tierColors.primary} />
            ) : (
              <div
                className="w-[140px] h-[140px] rounded-full flex items-center justify-center text-4xl shrink-0"
                style={{ border: `4px solid ${tierColors.primary}`, background: tierColors.bg }}
              >
                👑
              </div>
            )}

            {/* Tier info */}
            <div className="flex-1">
              <span
                className="inline-block text-xs font-semibold px-3 py-1.5 mb-4 tracking-widest uppercase"
                style={{ background: tierColors.primary, color: 'var(--ink)', letterSpacing: '0.2em' }}
              >
                {membership.tier?.name} Member
              </span>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>Annual Spend</p>
                  <p className="font-serif text-2xl font-medium" style={{ color: 'var(--cream)' }}>
                    ${Number(membership.annualSpendAud).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>Discount</p>
                  <p className="font-serif text-2xl font-medium" style={{ color: tierColors.primary }}>
                    {membership.tier?.discountPercentage}% off
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>Reward Points</p>
                  <p className="font-serif text-2xl font-medium" style={{ color: tierColors.primary }}>
                    {balance.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>= ${(balance / 100).toFixed(2)}</p>
                </div>
              </div>

              {membership.nextTier && (
                <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                  Spend{' '}
                  <b style={{ color: 'var(--cream)' }}>
                    ${(Number(membership.nextTier.minSpendAud) - Number(membership.annualSpendAud)).toFixed(2)}
                  </b>{' '}
                  more to unlock <b style={{ color: tierColors.primary }}>{membership.nextTier.name}</b>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Milestone timeline */}
      <div className="mb-12">
        <h2 className="font-serif text-xl font-medium mb-6" style={{ color: 'var(--cream)' }}>Your Journey</h2>
        <div className="relative flex items-start gap-0 overflow-x-auto pb-2">
          {/* Connecting line */}
          <div className="absolute top-4 left-4 right-4 h-px" style={{ background: 'var(--line)', zIndex: 0 }} />

          {MILESTONES.map((m, i) => {
            const tierIdx    = TIER_ORDER.indexOf(currentTierSlug);
            const unlocked   = i <= tierIdx + 1;
            return (
              <div key={m.id} className="relative flex flex-col items-center flex-1 min-w-[80px]" style={{ zIndex: 1 }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base mb-3 transition-all duration-300"
                  style={{
                    background: unlocked ? tierColors.primary : 'var(--ink-soft)',
                    border: unlocked ? 'none' : '1.5px solid var(--line)',
                    filter: unlocked ? 'none' : 'grayscale(1) opacity(0.4)',
                  }}
                >
                  {m.icon}
                </div>
                <p className="text-[0.6rem] tracking-widest uppercase text-center" style={{ color: unlocked ? 'var(--cream)' : 'var(--cream-dim)', letterSpacing: '0.1em', maxWidth: 80 }}>
                  {m.label}
                </p>
                {unlocked && (
                  <p className="text-[0.58rem] mt-1" style={{ color: 'var(--gold)' }}>+{m.points} pts</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        {/* Tiers comparison */}
        <div>
          <h2 className="font-serif text-xl font-medium mb-6" style={{ color: 'var(--cream)' }}>All Membership Tiers</h2>
          <div className="space-y-3">
            {(tiers ?? []).sort((a: any, b: any) => TIER_ORDER.indexOf(a.slug) - TIER_ORDER.indexOf(b.slug)).map((tier: any) => {
              const tc        = TIER_COLORS[tier.slug] ?? TIER_COLORS.free;
              const isCurrent = tier.id === membership?.tierId;
              return (
                <div
                  key={tier.id}
                  className="p-5"
                  style={{
                    border: `1px solid ${isCurrent ? tc.primary : 'var(--line)'}`,
                    background: isCurrent ? tc.bg : 'var(--ink-soft)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: tc.primary }}>{tier.name}</span>
                      {isCurrent && (
                        <span className="text-[0.56rem] tracking-wider uppercase px-2 py-0.5" style={{ border: `1px solid ${tc.primary}`, color: tc.primary, letterSpacing: '0.14em' }}>
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--cream-dim)' }}>
                      ${Number(tier.minSpendAud).toFixed(0)}+ annual
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--cream-dim)' }}>
                    <span style={{ color: tc.primary }}>✓ {tier.discountPercentage}% off orders</span>
                    <span style={{ color: tc.primary }}>✓ {Number(tier.rewardPointsMultiplier).toFixed(1)}× points</span>
                    {tier.freeDeliveryThreshold === 0 && <span style={{ color: tc.primary }}>✓ Free delivery</span>}
                    {tier.birthdayGift && <span style={{ color: tc.primary }}>✓ Birthday gift</span>}
                    {tier.festivalGift && <span style={{ color: tc.primary }}>✓ Festival gift</span>}
                    {tier.earlyAccess && <span style={{ color: tc.primary }}>✓ Early access</span>}
                    {tier.prioritySupport && <span style={{ color: tc.primary }}>✓ Priority support</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Redeem points */}
        <div>
          <div className="sticky top-24" style={{ border: '1px solid var(--line)', padding: 24, background: 'var(--ink-soft)' }}>
            <h2 className="font-serif text-xl font-medium mb-2" style={{ color: 'var(--cream)' }}>Redeem Points</h2>
            <p className="text-xs mb-5" style={{ color: 'var(--cream-dim)' }}>100 points = $1.00 discount on your next order.</p>
            <p className="text-2xl font-semibold mb-5" style={{ color: tierColors.primary, fontFamily: 'Jost' }}>
              {balance.toLocaleString()} pts
            </p>
            <label className="block text-[0.65rem] tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>Points to redeem</label>
            <div className="flex mb-4" style={{ border: '1px solid var(--line)' }}>
              <input
                type="number"
                min={100}
                step={100}
                max={balance}
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                placeholder="e.g. 500"
                className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
                style={{ color: 'var(--cream)', fontFamily: 'Jost' }}
              />
            </div>
            {redeemPoints && Number(redeemPoints) >= 100 && (
              <p className="text-xs mb-4" style={{ color: 'var(--gold)' }}>
                = ${(Number(redeemPoints) / 100).toFixed(2)} discount
              </p>
            )}
            <button
              onClick={() => redeemMutation.mutate(Number(redeemPoints))}
              disabled={redeemMutation.isPending || !redeemPoints || Number(redeemPoints) < 100 || Number(redeemPoints) > balance}
              className="w-full py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-50 hover:brightness-110"
              style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.18em' }}
            >
              {redeemMutation.isPending ? 'Redeeming…' : 'Redeem points'}
            </button>

            {history && history.length > 0 && (
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--line)' }}>
                <h3 className="text-[0.62rem] tracking-widest uppercase mb-3" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>Recent Activity</h3>
                <div className="space-y-2">
                  {history.slice(0, 5).map((tx: any) => (
                    <div key={tx.id} className="flex justify-between text-xs">
                      <span style={{ color: 'var(--cream-dim)' }}>{tx.description.substring(0, 28)}…</span>
                      <span style={{ color: tx.points > 0 ? 'var(--success)' : 'var(--error)', fontFamily: 'Jost' }}>
                        {tx.points > 0 ? '+' : ''}{tx.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
