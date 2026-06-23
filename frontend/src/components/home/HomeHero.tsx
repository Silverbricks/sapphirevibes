'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ease, staggerContainer, fadeUp } from '@/lib/motion';

const STATS = [
  { value: '140+', label: 'Curated pieces' },
  { value: '4.9★', label: 'Owner rating' },
  { value: 'Free', label: 'AU shipping $150+' },
];

export function HomeHero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100svh',
        background: 'var(--luxury-surface)',
        marginTop: '-66px',
        paddingTop: 66,
      }}
    >
      {/* Subtle warm gold glow — decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute"
        style={{
          top: '-8%',
          right: '-4%',
          width: 'clamp(380px, 52vw, 780px)',
          height: 'clamp(380px, 52vw, 780px)',
          background: 'radial-gradient(circle, rgba(180,145,85,0.07) 0%, transparent 65%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute"
        style={{
          bottom: '-6%',
          left: '-4%',
          width: 'clamp(280px, 38vw, 580px)',
          height: 'clamp(280px, 38vw, 580px)',
          background: 'radial-gradient(circle, rgba(180,145,85,0.05) 0%, transparent 65%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <div className="container-page w-full">
        <motion.div
          className="max-w-[820px] mx-auto text-center"
          style={{ paddingTop: 'clamp(48px, 6vw, 80px)', paddingBottom: 'clamp(80px, 10vw, 120px)' }}
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.12)}
        >
          {/* Eyebrow */}
          <motion.span
            className="eyebrow mb-6 inline-block"
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
          >
            Curated Luxury for the Australian Home
          </motion.span>

          {/* Headline */}
          <motion.h1
            className="h1 mb-6"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
            }}
            variants={fadeUp}
            transition={{ duration: 0.7, ease }}
          >
            Pieces that hold the{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>warmth</em>
            {' '}of a room.
          </motion.h1>

          {/* Gold rule */}
          <motion.div
            className="gold-rule mx-auto mb-7"
            style={{ maxWidth: 96, display: 'block' }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease }}
          />

          {/* Subtitle */}
          <motion.p
            style={{
              color: 'var(--cream-dim)',
              maxWidth: 560,
              margin: '0 auto 2.75rem',
              fontSize: '1.05rem',
              lineHeight: 1.75,
            }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
          >
            A small, considered collection of décor — lighting, ceramics, textiles,
            and objects chosen for the way they age, not the way they trend.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
          >
            <Link href="/products" className="btn-gold">
              Shop the collection
            </Link>
            <Link href="/products?view=collections" className="btn-ghost">
              Explore by room
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-12 gap-y-5 mt-16"
            style={{ paddingTop: 'clamp(32px, 4vw, 56px)', borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: 'clamp(40px, 5vw, 64px)' }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="font-serif font-semibold"
                  style={{
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                    color: 'var(--cream)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {value}
                </p>
                <p
                  className="text-[0.68rem] tracking-[0.16em] uppercase mt-1"
                  style={{ color: 'var(--cream-dim)' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-hidden="true"
      >
        <span
          className="text-[0.6rem] tracking-[0.24em] uppercase"
          style={{ color: 'var(--cream-dim)' }}
        >
          Scroll
        </span>
        <div
          className="w-px overflow-hidden"
          style={{ height: 36, background: 'var(--border-gold)' }}
        >
          <motion.div
            className="w-full"
            style={{ height: '50%', background: 'var(--gold)' }}
            animate={{ y: ['0%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
