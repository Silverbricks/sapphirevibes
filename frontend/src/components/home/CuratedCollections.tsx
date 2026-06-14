'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, ease } from '@/lib/motion';

const COLLECTIONS = [
  { slug: 'wall-art', label: 'Wall Art', count: 68, bg: 'linear-gradient(140deg,#3a4a3c,#1c2620)' },
  { slug: 'statues', label: 'Statues', count: 74, bg: 'linear-gradient(140deg,#4a3c2e,#241c14)' },
  { slug: 'mirrors', label: 'Mirrors', count: 32, bg: 'linear-gradient(140deg,#2e3a4a,#141c24)' },
  { slug: 'planters', label: 'Planters & Greenery', count: 93, bg: 'linear-gradient(140deg,#43304a,#1e1424)' },
];

export function CuratedCollections() {
  return (
    <section id="shop" className="py-28">
      <div className="container-page">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap reveal">
          <div>
            <span className="eyebrow block mb-3.5">Explore by mood</span>
            <h2
              className="font-serif font-medium leading-none"
              style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }}
            >
              Curated Collections
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-[0.76rem] tracking-widest uppercase pb-1.5 transition-colors duration-300"
            style={{ color: 'var(--gold)', borderBottom: '1px solid var(--line)', letterSpacing: '0.2em' }}
          >
            View all categories →
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {COLLECTIONS.map((col, i) => (
            <motion.div key={col.slug} variants={fadeUp} transition={{ duration: 0.5, ease, delay: i * 0.07 }}>
            <Link
              href={`/categories/${col.slug}`}
              className="relative flex items-end overflow-hidden cursor-pointer group"
              style={{
                aspectRatio: '3/4',
                border: '1px solid var(--line)',
                background: col.bg,
              }}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: col.bg }}
              />
              <div
                className="relative z-10 p-6 w-full"
                style={{ background: 'linear-gradient(180deg,transparent,rgba(10,12,16,.92))' }}
              >
                <p
                  className="text-[0.72rem] tracking-widest uppercase mb-1"
                  style={{ color: 'var(--gold-bright)', letterSpacing: '0.18em' }}
                >
                  {col.count} pieces
                </p>
                <h3 className="font-serif text-2xl font-semibold" style={{ color: 'var(--cream)' }}>
                  {col.label}
                </h3>
              </div>
            </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
