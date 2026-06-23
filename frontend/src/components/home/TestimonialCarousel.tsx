'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ease } from '@/lib/motion';

const TESTIMONIALS = [
  {
    id: 1,
    quote: 'The Aurelia lamp completely changed the corner of our living room. Photos did not do the glow justice.',
    name: 'Priya M.',
    location: 'Melbourne, VIC',
    rating: 5,
  },
  {
    id: 2,
    quote: 'Wrapped beautifully, arrived in two days, and the ceramic has tiny imperfections that make it feel real.',
    name: 'James T.',
    location: 'Adelaide, SA',
    rating: 5,
  },
  {
    id: 3,
    quote: "I have bought three pieces now. The curation is genuinely good — nothing here looks like everything else.",
    name: 'Hannah W.',
    location: 'Byron Bay, NSW',
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < count ? 'var(--gold)' : 'none'}
          stroke="var(--gold)" strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="section-pad"
      style={{
        background: 'var(--luxury-surface)',
        borderTop: '1px solid var(--border-gold)',
      }}
    >
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">From our customers</p>
          <h2 className="h1">
            Loved in homes across{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Australia</em>.
          </h2>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="p-8 flex flex-col"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${i === active ? 'var(--gold)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: i === active ? '0 8px 32px rgba(180,145,85,0.10)' : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
              }}
              onMouseEnter={() => setActive(i)}
            >
              <StarRating count={t.rating} />
              <p
                className="font-serif italic text-[1.05rem] leading-relaxed mb-7 flex-1"
                style={{ color: 'var(--cream)' }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-semibold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--muted-gold))',
                    color: '#FFFFFF',
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: single animated card */}
        <div className="lg:hidden relative overflow-hidden" style={{ minHeight: 280 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease }}
              className="p-8"
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--gold)',
                boxShadow: '0 8px 32px rgba(180,145,85,0.10)',
              }}
            >
              <StarRating count={TESTIMONIALS[active].rating} />
              <p
                className="font-serif italic text-[1.05rem] leading-relaxed mb-6"
                style={{ color: 'var(--cream)' }}
              >
                &ldquo;{TESTIMONIALS[active].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-semibold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--muted-gold))',
                    color: '#FFFFFF',
                  }}
                >
                  {TESTIMONIALS[active].name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>{TESTIMONIALS[active].name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)' }}>{TESTIMONIALS[active].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  background: i === active ? 'var(--gold)' : 'rgba(0,0,0,0.15)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop dots */}
        <div className="hidden lg:flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                background: i === active ? 'var(--gold)' : 'rgba(0,0,0,0.15)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
