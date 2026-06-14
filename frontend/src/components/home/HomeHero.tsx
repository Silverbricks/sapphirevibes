'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ease, staggerContainer, fadeUp } from '@/lib/motion';
import { useRef } from 'react';

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: '100svh', background: 'var(--luxury-surface)', marginTop: '-66px' }}
    >
      {/* Parallax background orbs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Warm gold glow — upper right */}
        <div
          className="absolute"
          style={{
            top: '-8%', right: '-6%',
            width: 'clamp(300px, 46vw, 700px)',
            height: 'clamp(300px, 46vw, 700px)',
            background: 'radial-gradient(circle, rgba(200,164,92,0.15) 0%, transparent 68%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.55,
          }}
        />
        {/* Blue glow — lower left */}
        <div
          className="absolute"
          style={{
            bottom: '-12%', left: '-8%',
            width: 'clamp(250px, 38vw, 600px)',
            height: 'clamp(250px, 38vw, 600px)',
            background: 'radial-gradient(circle, rgba(60,90,150,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.55,
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(200,164,92,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,164,92,0.025) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      {/* Main content — left aligned, matching HTML reference */}
      <motion.div
        style={{ opacity: fadeOut }}
        className="container-page relative z-10 w-full"
      >
        <motion.div
          className="max-w-[760px]"
          variants={staggerContainer(0.12, 0.08)}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.p
            className="eyebrow mb-6"
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
          >
            Curated Luxury for the Australian Home
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.75, ease }}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 500,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
              marginBottom: '1.8rem',
            }}
          >
            Pieces that hold
            <br />the{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>warmth</em>
            {' '}of a room.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
            style={{
              color: 'var(--cream-dim)',
              maxWidth: 480,
              fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: '2.6rem',
            }}
          >
            A small, considered collection of décor — lighting, ceramics, textiles, and objects chosen for the way they age, not the way they trend.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className="btn-gold rounded-full px-8 py-[14px] text-[0.78rem] tracking-[0.18em]"
            >
              Shop the collection
            </Link>
            <Link
              href="/products?view=collections"
              className="btn-ghost rounded-full px-8 py-[14px] text-[0.78rem] tracking-[0.18em]"
            >
              Explore by room
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease }}
            className="flex flex-wrap gap-10 mt-14"
          >
            {[
              { value: '140+', label: 'Curated pieces' },
              { value: '4.9★', label: 'Owner rating' },
              { value: 'Afterpay', label: 'Available at checkout' },
            ].map((stat, i) => (
              <div key={i}>
                <p
                  className="font-serif font-medium"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--gold)', lineHeight: 1 }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[0.7rem] tracking-[0.16em] uppercase mt-1.5"
                  style={{ color: 'var(--cream-dim)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <p className="text-[0.62rem] tracking-[0.28em] uppercase" style={{ color: 'var(--cream-dim)' }}>Scroll</p>
        <div
          className="w-px relative overflow-hidden"
          style={{ height: 46, background: 'rgba(200,164,92,0.2)' }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{ height: '40%', background: 'var(--gold)' }}
            animate={{ y: ['-100%', '250%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
