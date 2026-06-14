'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '⊡' },
  { href: '/admin/products', label: 'Products', icon: '🏺' },
  { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/reviews', label: 'Reviews / UGC', icon: '★' },
  { href: '/admin/customers', label: 'Customers', icon: '👤' },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: '👑' },
  { href: '/admin/promotions', label: 'Promotions', icon: '💸' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN')) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 hidden md:flex flex-col"
        style={{ background: 'var(--ink-soft)', borderRight: '1px solid var(--line)', position: 'sticky', top: 0, height: '100vh' }}
      >
        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <Link href="/" className="font-serif text-lg font-semibold" style={{ color: 'var(--cream)' }}>
            Sapphire<span style={{ color: 'var(--gold)' }}>Vibes</span>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-6 py-3 text-sm transition-colors duration-200 relative"
                style={{
                  color: active ? 'var(--gold)' : 'var(--cream-dim)',
                  background: active ? 'rgba(200,164,92,.08)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'var(--gold)' }}
                    transition={{ duration: 0.25 }}
                  />
                )}
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pb-5" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>{user?.firstName} {user?.lastName}</p>
          <p className="text-[0.6rem] tracking-wider uppercase mt-0.5" style={{ color: 'var(--gold)', letterSpacing: '0.14em' }}>{user?.role}</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
