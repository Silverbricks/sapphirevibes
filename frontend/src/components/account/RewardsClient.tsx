'use client';

import { useQuery } from '@tanstack/react-query';
import { membershipsService } from '@/services/memberships.service';
import Link from 'next/link';

export function RewardsClient() {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['my-rewards'],
    queryFn: membershipsService.getRewardsBalance,
    retry: false,
  });

  const balance = rewards?.balance ?? 0;
  const dollarValue = (balance / 100).toFixed(2);

  const HOW_TO_EARN = [
    { action: 'Place an order',              points: '1 pt per $1 spent' },
    { action: 'Write a product review',      points: '50 pts' },
    { action: 'Refer a friend',              points: '200 pts' },
    { action: 'Create an account',           points: '200 welcome pts' },
    { action: 'Subscribe to newsletter',     points: '25 pts' },
  ];

  return (
    <div className="container-page py-14">
      <p className="eyebrow mb-4">My Account</p>
      <h1 className="font-serif text-3xl font-medium mb-10" style={{ color: 'var(--cream)' }}>Rewards</h1>

      {isLoading ? (
        <div style={{ color: 'var(--cream-dim)', padding: 40 }}>Loading rewards…</div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Balance card */}
          <div>
            <div className="p-8 mb-8" style={{ border: '1px solid var(--line)', background: 'linear-gradient(135deg,var(--ink-soft),var(--ink))' }}>
              <p className="eyebrow mb-4">Current balance</p>
              <p className="font-serif" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'var(--gold)', lineHeight: 1 }}>
                {balance.toLocaleString()} <span className="text-2xl">pts</span>
              </p>
              <p className="text-sm mt-3" style={{ color: 'var(--cream-dim)' }}>
                Worth <span style={{ color: 'var(--gold)' }}>${dollarValue} AUD</span> at checkout
              </p>
              {balance > 0 && (
                <Link href="/checkout" className="btn-gold inline-block mt-6 text-[0.74rem] tracking-[0.18em] px-8 py-3">
                  Redeem at checkout
                </Link>
              )}
            </div>

            <h2 className="font-serif text-xl mb-6" style={{ color: 'var(--cream)' }}>How to earn points</h2>
            <div className="space-y-3">
              {HOW_TO_EARN.map(({ action, points }) => (
                <div
                  key={action}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--cream)' }}>{action}</p>
                  <span
                    className="text-xs tracking-wider uppercase"
                    style={{ color: 'var(--gold)', letterSpacing: '0.16em', fontFamily: 'Inter' }}
                  >
                    {points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Membership tier */}
          <div>
            <div className="p-6" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>Membership Tiers</p>
              {[
                { name: 'Free',   min: '$0',     perks: 'Base earn rate' },
                { name: 'Silver', min: '$500',   perks: '1.5× earn rate' },
                { name: 'Gold',   min: '$1,500', perks: '2× earn rate + early access' },
                { name: 'VIP',    min: '$3,000', perks: '3× earn rate + personal stylist' },
              ].map(({ name, min, perks }) => (
                <div key={name} className="py-4" style={{ borderBottom: '1px solid var(--line)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>{min}/yr</p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>{perks}</p>
                </div>
              ))}
              <Link href="/membership" className="block text-center mt-4 text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.18em' }}>
                View membership details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
