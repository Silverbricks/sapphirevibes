'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { STD, ease, slideInRight } from '@/lib/motion';

const NAV = [
  { label: 'Shop',        href: '/products' },
  { label: 'Collections', href: '/products?view=collections' },
  { label: 'About',       href: '/about' },
];

export function SiteHeader() {
  const itemCount                   = useCartStore((s) => s.itemCount);
  const { openCart }                = useUIStore();
  const [scrolled, setScrolled]     = useState(false);
  const [badgePop, setBadgePop]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevCount                   = useRef(itemCount);
  const { scrollY }                 = useScroll();
  const pathname                    = usePathname();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBadgePop(true);
      const t = setTimeout(() => setBadgePop(false), 350);
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100]"
        animate={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.97)'
            : 'rgba(255, 255, 255, 0)',
          backdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
          borderBottomColor: scrolled ? 'rgba(0,0,0,0.07)' : 'transparent',
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          borderBottom: '1px solid transparent',
          WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
        }}
      >
        <nav className="container-page flex items-center justify-between h-[66px]">

          {/* ── Brand ────────────────────────── */}
          <Link
            href="/"
            className="font-serif text-[1.45rem] font-semibold tracking-wide shrink-0"
            style={{ color: 'var(--cream)' }}
          >
            Sapphire<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Vibes</span>
          </Link>

          {/* ── Nav links (desktop) ──────────── */}
          <ul className="hidden md:flex gap-9 list-none absolute left-1/2 -translate-x-1/2">
            {NAV.map(({ label, href }) => {
              const active =
                pathname === href ||
                (href !== '/' && pathname.startsWith(href.split('?')[0]));
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className="relative text-[0.78rem] tracking-[0.14em] uppercase transition-colors duration-300"
                    style={{ color: active ? 'var(--cream)' : 'var(--cream-dim)' }}
                  >
                    <motion.span className="relative" whileHover="hover" initial="rest">
                      {label}
                      <motion.span
                        className="absolute left-0 -bottom-[5px] h-px w-full block"
                        style={{ background: 'var(--gold)', transformOrigin: 'left center' }}
                        variants={{ rest: { scaleX: active ? 1 : 0 }, hover: { scaleX: 1 } }}
                        transition={{ duration: STD, ease }}
                      />
                    </motion.span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Icon row ─────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              className="hidden md:flex items-center justify-center transition-colors duration-300"
              style={{ color: 'var(--cream-dim)', width: 36, height: 36 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center transition-colors duration-300"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-dim)', minWidth: 44, minHeight: 44 }}
              aria-label="Open cart"
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    className="absolute -top-[7px] -right-[9px] min-w-[16px] h-[16px] rounded-full text-[0.52rem] font-semibold flex items-center justify-center px-[3px]"
                    style={{ background: 'var(--gold)', color: '#FFFFFF' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: badgePop ? [1, 1.35, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)', minWidth: 44, minHeight: 44 }}
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile Drawer ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              style={{ zIndex: 59 }}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 z-[60] flex flex-col"
              style={{
                width: 'min(300px, 85vw)',
                background: '#FFFFFF',
                borderLeft: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
              }}
              variants={slideInRight}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.32, ease }}
            >
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
              >
                <Link href="/" className="font-serif text-lg font-semibold" style={{ color: 'var(--cream)' }}>
                  Sapphire<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Vibes</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-dim)', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 px-6 py-8 overflow-y-auto">
                <ul className="space-y-6">
                  {NAV.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="font-serif text-2xl font-medium block transition-colors duration-200"
                        style={{ color: 'var(--cream)' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-8 space-y-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-sm transition-colors duration-200"
                    style={{ color: 'var(--cream-dim)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                    My Account
                  </Link>
                  <button
                    onClick={openCart}
                    className="flex items-center gap-3 text-sm w-full text-left transition-colors duration-200"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-dim)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </button>
                </div>
              </div>

              <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>
                  Free AU shipping over $150 · Afterpay available
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
