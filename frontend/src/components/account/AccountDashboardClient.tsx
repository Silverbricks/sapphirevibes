'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { membershipsService } from '@/services/memberships.service';
import { subscriptionsService } from '@/services/subscriptions.service';
import { redirect } from 'next/navigation';

const TIER_COLORS: Record<string, string> = {
  free: '#9ca3af',
  silver: '#d1d5db',
  gold: 'var(--gold)',
  vip: 'var(--gold-bright)',
};

const NAV_LINKS = [
  { href: '/account', label: 'Dashboard', icon: '⊡' },
  { href: '/account/orders', label: 'My Orders', icon: '📦' },
  { href: '/account/wishlist', label: 'Wishlist', icon: '♡' },
  { href: '/account/rewards', label: 'Rewards', icon: '⭐' },
  { href: '/subscription', label: 'Subscription', icon: '👑' },
  { href: '/membership', label: 'Membership', icon: '🏅' },
];

export function AccountDashboardClient() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  if (!isAuthenticated || !user) {
    redirect('/login');
  }

  const { data: ordersData } = useQuery({ queryKey: ['my-orders'], queryFn: () => ordersService.getMyOrders() });
  const { data: membership } = useQuery({ queryKey: ['my-membership'], queryFn: membershipsService.getMy });
  const { data: subscription } = useQuery({ queryKey: ['my-subscription'], queryFn: subscriptionsService.getMy });
  const { data: rewardsData } = useQuery({ queryKey: ['my-rewards'], queryFn: membershipsService.getRewardsBalance });

  const orders = ordersData?.data ?? [];
  const tierSlug = membership?.tier?.slug ?? 'free';
  const tierColor = TIER_COLORS[tierSlug] ?? 'var(--gold)';

  return (
    <div className="container-page py-14">
      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar nav */}
        <aside>
          <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--line)' }}>
            <div className="w-14 h-14 rounded-full mb-3 flex items-center justify-center font-serif text-2xl font-medium" style={{ background: 'linear-gradient(135deg,var(--gold),#7a6234)', color: 'var(--ink)' }}>
              {user.firstName.charAt(0)}
            </div>
            <p className="font-medium text-sm" style={{ color: 'var(--cream)' }}>{user.firstName} {user.lastName}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>{user.email}</p>
            <span
              className="inline-block mt-2 text-xs px-2.5 py-1 tracking-wider uppercase"
              style={{ border: `1px solid ${tierColor}`, color: tierColor, letterSpacing: '0.18em', fontSize: '0.58rem' }}
            >
              {membership?.tier?.name ?? 'Free'} Member
            </span>
          </div>

          <nav className="space-y-1">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-300"
                style={{ color: 'var(--cream-dim)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-dim)'; }}
              >
                <span className="text-base w-5">{icon}</span>
                {label}
              </Link>
            ))}
            <button
              onClick={clearAuth}
              className="flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left transition-colors duration-300"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-dim)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#f87171')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)')}
            >
              <span className="text-base w-5">→</span>Sign out
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <div>
          <h1 className="font-serif text-3xl font-medium mb-10" style={{ color: 'var(--cream)' }}>
            Welcome back, {user.firstName}
          </h1>

          {/* Stats cards */}
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            <StatCard
              icon="📦"
              label="Total Orders"
              value={ordersData?.meta?.total ?? '—'}
            />
            <StatCard
              icon="⭐"
              label="Reward Points"
              value={rewardsData?.balance ?? 0}
              sub={`= $${((rewardsData?.balance ?? 0) / 100).toFixed(2)} value`}
            />
            <StatCard
              icon="👑"
              label="Membership"
              value={membership?.tier?.name ?? 'Free'}
              sub={subscription?.status === 'ACTIVE' ? 'Subscriber ✓' : 'No active plan'}
            />
          </div>

          {/* Recent orders */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-medium" style={{ color: 'var(--cream)' }}>Recent Orders</h2>
              <Link href="/account/orders" className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>View all →</Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-10 text-center" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                <p className="text-sm mb-3" style={{ color: 'var(--cream-dim)' }}>No orders yet</p>
                <Link href="/products" className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>Start shopping →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order: any) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-4 transition-all duration-300 group"
                    style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', textDecoration: 'none' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,164,92,.45)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--line)')}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>{order.orderNumber}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm" style={{ color: 'var(--gold-bright)', fontFamily: 'Jost' }}>${Number(order.total).toFixed(2)}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Membership progress */}
          {membership && (
            <div style={{ border: '1px solid var(--line)', padding: 24, background: 'var(--ink-soft)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: tierColor, letterSpacing: '0.2em' }}>{membership.tier?.name} Member</p>
                  <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                    Annual spend: <b style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>${Number(membership.annualSpendAud).toFixed(2)}</b>
                  </p>
                </div>
                <Link href="/membership" className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.18em' }}>Details →</Link>
              </div>

              {membership.nextTier && (
                <>
                  <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--cream-dim)' }}>
                    <span>Progress to {membership.nextTier.name}</span>
                    <span style={{ color: 'var(--cream)' }}>{Math.round(membership.progressToNextTier ?? 0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--line)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${membership.progressToNextTier ?? 0}%`, background: `linear-gradient(90deg,var(--gold),var(--gold-bright))` }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--cream-dim)' }}>
                    ${(Number(membership.nextTier.minSpendAud) - Number(membership.annualSpendAud)).toFixed(2)} more to reach <b style={{ color: tierColor }}>{membership.nextTier.name}</b>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-5" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>{label}</p>
      <p className="font-serif text-2xl font-medium" style={{ color: 'var(--cream)' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'var(--cream-dim)',
    CONFIRMED: '#60a5fa',
    PROCESSING: '#fbbf24',
    PACKED: '#a78bfa',
    SHIPPED: '#34d399',
    DELIVERED: 'var(--gold)',
    RETURNED: '#f87171',
    CANCELLED: '#f87171',
  };
  return (
    <span className="text-[0.6rem] tracking-wider uppercase mt-0.5 block" style={{ color: colors[status] ?? 'var(--cream-dim)', letterSpacing: '0.14em' }}>
      {status}
    </span>
  );
}
