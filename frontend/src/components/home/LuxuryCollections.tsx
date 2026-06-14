'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ease, fadeUp, staggerContainer } from '@/lib/motion';

const COLLECTIONS = [
  {
    name: 'The Living Room',
    slug: 'living',
    eyebrow: 'The Living Room',
    subtitle: 'Quiet luxury for the spaces you live in most',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
    large: true,
  },
  {
    name: 'Lighting',
    slug: 'lighting',
    eyebrow: 'Lighting',
    subtitle: 'Warm glow, sculpted form',
    img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80',
    large: false,
  },
  {
    name: 'Ceramics & Objects',
    slug: 'decor-objects',
    eyebrow: 'Ceramics & Objects',
    subtitle: 'Handmade, never identical',
    img: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80',
    large: false,
  },
];

function CollectionCard({ col, large }: { col: typeof COLLECTIONS[0]; large: boolean }) {
  return (
    <Link
      href={`/products?category=${col.slug}`}
      className="group block relative overflow-hidden"
      style={{
        // Large card fills the grid row-span, small cards keep 4/3 aspect
        aspectRatio: large ? undefined : '4/3',
        height: large ? '100%' : undefined,
        minHeight: large ? 280 : undefined,
        borderRadius: 4,
        border: '1px solid transparent',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(.2,.7,.2,1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(200,164,92,0.22)';
        el.style.boxShadow = '0 20px 50px rgba(200,164,92,0.15)';
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'transparent';
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
      }}
    >
      {/* Background image — scales on hover via group */}
      <div className="absolute inset-0 transition-transform duration-[700ms] group-hover:scale-[1.06]">
        <Image
          src={col.img}
          alt={col.name}
          fill
          sizes={large ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover"
          priority={large}
        />
      </div>

      {/* Dark gradient overlay — z-[1] so it sits above image, below content */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(transparent 30%, rgba(8,10,14,0.88))' }}
      />

      {/* Content — z-[2], correctly positioned absolute (NOT relative) */}
      <div className="absolute bottom-0 left-0 right-0 p-7 z-[2]">
        <p className="eyebrow mb-2" style={{ fontSize: '0.68rem' }}>{col.eyebrow}</p>
        <h3
          className="font-serif font-medium leading-tight mb-2"
          style={{
            fontSize: large ? 'clamp(1.5rem, 2.5vw, 2rem)' : 'clamp(1.2rem, 2vw, 1.6rem)',
            color: '#fff',
          }}
        >
          {col.name}
        </h3>
        <p className="text-sm mb-4" style={{ color: 'rgba(244,239,230,0.75)' }}>{col.subtitle}</p>
        <span
          className="inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
          style={{
            color: 'var(--gold-bright)',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Explore the edit →
        </span>
      </div>
    </Link>
  );
}

export function LuxuryCollections() {
  const [large, ...rest] = COLLECTIONS;

  return (
    <section
      className="section-pad"
      style={{ background: 'var(--ink)' }}
    >
      <div className="container-page">
        {/* Section header */}
        <motion.div
          className="mb-10 sm:mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer(0.1)}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6, ease }}>
            <p className="eyebrow mb-4">Shop by collection</p>
            <h2 className="h2 mb-3">Rooms, reconsidered.</h2>
            <p style={{ color: 'var(--cream-dim)', maxWidth: 480 }}>
              Four edits, each built around a single feeling rather than a category.
            </p>
          </motion.div>
        </motion.div>

        {/* Magazine grid — lg: 2fr 1fr, large card spans 2 rows */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3"
          style={{ gridAutoRows: 'minmax(240px, auto)' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer(0.12)}
        >
          {/* Large card — spans 2 rows on sm+ */}
          <motion.div
            className="md:row-span-2"
            variants={fadeUp}
            transition={{ duration: 0.7, ease }}
          >
            <CollectionCard col={large} large={true} />
          </motion.div>

          {/* Two stacked small cards */}
          {rest.map((col, i) => (
            <motion.div
              key={col.slug}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: (i + 1) * 0.08, ease }}
            >
              <CollectionCard col={col} large={false} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
