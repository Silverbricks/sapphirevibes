'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, STD, ease } from '@/lib/motion';
import { productsService } from '@/services/products.service';
import { ProductCard } from '@/components/product/ProductCard';

type CollectionSlug = 'latest' | 'hot' | 'trending' | 'festival-deals';

const TABS: Array<{ key: CollectionSlug; label: string }> = [
  { key: 'latest', label: 'Latest Arrivals' },
  { key: 'hot', label: 'Hot Deals' },
  { key: 'trending', label: 'Trending Now' },
  { key: 'festival-deals', label: 'Festival Specials' },
];

export function CollectionTabs() {
  const [active, setActive] = useState<CollectionSlug>('latest');

  const { data, isLoading } = useQuery({
    queryKey: ['collection', active],
    queryFn: () => productsService.getCollection(active),
    staleTime: 5 * 60 * 1000,
  });

  const products: any[] = data?.data ?? data ?? [];

  return (
    <section className="py-20">
      <div className="container-page">
        {/* Section heading */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="eyebrow block mb-3.5">Curated for you</span>
          <h2 className="font-serif font-medium leading-none" style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }}>
            Shop the Collections
          </h2>
        </motion.div>

        {/* Tab strip */}
        <div className="flex gap-0 overflow-x-auto mb-10" style={{ borderBottom: '1px solid var(--line)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="relative px-6 py-3.5 text-[0.76rem] tracking-widest uppercase whitespace-nowrap transition-colors duration-200 flex-shrink-0"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Jost, sans-serif',
                color: active === tab.key ? 'var(--cream)' : 'var(--cream-dim)',
                letterSpacing: '0.18em',
              }}
            >
              {tab.label}
              {active === tab.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: 'var(--gold)' }}
                  transition={{ duration: STD, ease }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: STD, ease }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ aspectRatio: '3/4', background: 'var(--ink-soft)', border: '1px solid var(--line)' }}>
                    <motion.div
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--ink-soft) 25%, var(--panel) 50%, var(--ink-soft) 75%)', backgroundSize: '200% 100%' }}
                      animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                ))
              : products.slice(0, 4).map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
