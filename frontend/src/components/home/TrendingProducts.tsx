'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, STD, ease } from '@/lib/motion';

const PRODUCTS = [
  { slug: 'hills-gold-wall-shelf', name: 'Hills Gold Wall Shelf', category: 'Wall Décor', price: 302.50, badge: 'Best Seller', badgeDark: false, rating: 5, col: 'linear-gradient(180deg,#e4c884,#9c7c3c)', shape: { width: '72%', height: '28%', borderRadius: '4px 4px 2px 2px' } },
  { slug: 'brass-black-vase', name: 'Brass Black Vase', category: 'Vases', price: 412.50, badge: 'New', badgeDark: true, rating: 5, col: 'linear-gradient(180deg,#2a2a2e,#0c0c0e)', shape: { width: '32%', height: '60%', borderRadius: '46% 46% 48% 48%/60% 60% 40% 40%' } },
  { slug: 'iona-resin-cheetah', name: 'Iona Resin Cheetah', category: 'Statues', price: 181.50, badge: 'Trending', badgeDark: false, rating: 4, col: 'linear-gradient(180deg,#caa869,#7a5e2e)', shape: { width: '52%', height: '65%', borderRadius: '38% 62% 44% 56%/56% 44% 56% 44%' } },
  { slug: 'nube-metal-mirror', name: 'Nube Metal Mirror', category: 'Mirrors', price: 242.00, badge: 'Low Stock', badgeDark: true, rating: 5, col: 'linear-gradient(180deg,#9fb3c8,#3a4a5c)', shape: { width: '55%', height: '55%', borderRadius: '50%' } },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: 2 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export function TrendingProducts() {
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  function toggleWish(slug: string) {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) { next.delete(slug); toast('Removed from wishlist'); }
      else { next.add(slug); toast('Saved to wishlist'); }
      return next;
    });
  }

  return (
    <section className="pb-28">
      <div className="container-page">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap reveal">
          <div>
            <span className="eyebrow block mb-3.5">Most loved this season</span>
            <h2 className="font-serif font-medium leading-none" style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }}>
              Trending Now
            </h2>
          </div>
          <Link href="/collections/trending" className="text-[0.76rem] tracking-widest uppercase pb-1.5 transition-colors duration-300" style={{ color: 'var(--gold)', borderBottom: '1px solid var(--line)', letterSpacing: '0.2em' }}>
            All trending →
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.slug}
              className="relative overflow-hidden group"
              variants={fadeUp}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              whileHover={{ y: -6, borderColor: 'rgba(200,164,92,.45)', transition: { duration: STD } }}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--ink-soft)',
              }}
            >
              {/* Image area */}
              <div className="aspect-square relative flex items-center justify-center overflow-hidden">
                <span
                  className="absolute top-3.5 left-3.5 z-10 text-[0.6rem] tracking-widest uppercase px-2.5 py-1.5 font-semibold"
                  style={{
                    background: p.badgeDark ? 'var(--ink)' : 'var(--gold)',
                    color: p.badgeDark ? 'var(--gold)' : 'var(--ink)',
                    border: p.badgeDark ? '1px solid var(--line)' : 'none',
                    letterSpacing: '0.18em',
                  }}
                >
                  {p.badge}
                </span>
                <button
                  className="absolute top-3 right-3 w-[34px] h-[34px] z-10 flex items-center justify-center transition-colors duration-300"
                  style={{
                    border: '1px solid var(--line)',
                    background: 'rgba(14,17,22,.6)',
                  }}
                  onClick={() => toggleWish(p.slug)}
                  aria-label="Add to wishlist"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wishlisted.has(p.slug) ? 'var(--gold)' : 'none'} stroke={wishlisted.has(p.slug) ? 'var(--gold)' : 'var(--cream)'} strokeWidth="1.4">
                    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z" />
                  </svg>
                </button>
                <div
                  className="transition-transform duration-600 group-hover:-translate-y-1 group-hover:-rotate-2"
                  style={{
                    width: p.shape.width,
                    height: p.shape.height,
                    background: p.col,
                    borderRadius: p.shape.borderRadius,
                    boxShadow: 'var(--shadow)',
                  }}
                />
              </div>

              {/* Meta */}
              <div className="p-5">
                <div className="text-[0.64rem] tracking-widest uppercase mb-1" style={{ color: 'var(--cream-dim)', letterSpacing: '0.2em' }}>
                  {p.category}
                </div>
                <Link href={`/products/${p.slug}`}>
                  <h3 className="font-serif text-[1.28rem] font-medium mb-2 hover:opacity-80 transition-opacity" style={{ color: 'var(--cream)' }}>
                    {p.name}
                  </h3>
                </Link>
                <StarRating rating={p.rating} />
                <div className="text-[1.05rem] mt-1" style={{ color: 'var(--gold-bright)', fontFamily: 'Jost' }}>
                  ${p.price.toFixed(2)}
                </div>
                <div className="text-[0.62rem] mt-0.5" style={{ color: 'var(--cream-dim)', letterSpacing: '0.04em' }}>
                  or 4 × ${(p.price / 4).toFixed(2)} with Afterpay
                </div>
                <motion.button
                  className="mt-3.5 w-full py-3 text-[0.68rem] tracking-widest uppercase"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    color: 'var(--cream)',
                    fontFamily: 'Jost',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                  }}
                  whileHover={{ background: 'var(--gold)', color: 'var(--ink)', borderColor: 'var(--gold)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    addGuestItem(p.name);
                    toast(`Added · ${p.name}`);
                  }}
                >
                  Add to cart
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
