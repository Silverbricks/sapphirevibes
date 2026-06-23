'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    label: 'Shop',
    href: '/products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: 'Cart',
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: 'Account',
    href: '/account',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
];

export function MobileNav() {
  const pathname   = usePathname();
  const itemCount  = useCartStore((s) => s.itemCount);
  const { openCart } = useUIStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--line)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
      }}
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isCart   = label === 'Cart';
          const isActive = href ? (href === '/' ? pathname === '/' : pathname.startsWith(href)) : false;

          if (isCart) {
            return (
              <button
                key={label}
                onClick={openCart}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 pt-3 pb-2 transition-colors duration-200"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--cream-dim)',
                  minHeight: 64,
                }}
                aria-label="Open cart"
              >
                <div className="relative">
                  {icon}
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key="badge"
                        className="absolute -top-[5px] -right-[7px] min-w-[14px] h-[14px] rounded-full text-[0.48rem] font-semibold flex items-center justify-center"
                        style={{ background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'Inter' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[0.58rem] tracking-widest uppercase" style={{ letterSpacing: '0.14em' }}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={label}
              href={href!}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 pt-3 pb-2 transition-colors duration-200"
              style={{
                color: isActive ? 'var(--gold)' : 'var(--cream-dim)',
                minHeight: 64,
              }}
            >
              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ background: 'var(--gold)' }}
                  transition={{ duration: 0.25 }}
                />
              )}
              {icon}
              <span className="text-[0.58rem] tracking-widest uppercase" style={{ letterSpacing: '0.14em' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
