'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, ease } from '@/lib/motion';
import { productsService } from '@/services/products.service';
import { ProductCard } from './ProductCard';

interface Props {
  categorySlug: string;
  excludeProductId: string;
}

export function CompleteTheRoom({ categorySlug, excludeProductId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['complete-the-room', categorySlug, excludeProductId],
    queryFn: () => productsService.list({ category: categorySlug, limit: 4 }),
    staleTime: 5 * 60 * 1000,
  });

  const raw: any[] = data?.data ?? [];
  const products = raw.filter((p: any) => p.id !== excludeProductId).slice(0, 4);

  if (!isLoading && products.length === 0) return null;

  return (
    <section style={{ borderTop: '1px solid var(--line)', paddingTop: 60, marginTop: 60 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        style={{ marginBottom: 32 }}
      >
        <span className="eyebrow block mb-3.5">Styled together</span>
        <h2 className="font-serif font-medium" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>Complete the Room</h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '3/4', background: 'var(--ink-soft)', border: '1px solid var(--line)' }} />
            ))
          : products.map((product: any, i: number) => (
              <motion.div key={product.id} variants={fadeUp} transition={{ duration: 0.45, ease, delay: i * 0.07 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
}
