'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { ProductCard } from './ProductCard';
import { FilterDrawer } from './FilterDrawer';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, ease } from '@/lib/motion';
import { useState } from 'react';

interface Props {
  initialQuery?: Record<string, string | undefined>;
}

interface FilterState {
  badge?: string;
  minPrice?: number;
  maxPrice?: number;
}

const SORTS = [
  { label: 'Newest',           value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Most Popular',     value: 'popular' },
];

export function ProductListingClient({ initialQuery = {} }: Props) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    badge: initialQuery.badge,
  });
  const [sort, setSort]   = useState('newest');
  const [page, setPage]   = useState(1);

  const query = {
    category: initialQuery.category,
    collection: initialQuery.collection,
    badge: filters.badge,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort,
    page,
    limit: 20,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', query],
    queryFn: () => productsService.list(query),
    retry: 1,
  });

  const products = data?.data ?? [];
  const meta     = data?.meta;

  function clearFilters() {
    setFilters({});
    setPage(1);
  }

  const activeFilterCount = [filters.badge, filters.minPrice ?? filters.maxPrice].filter(Boolean).length;

  return (
    <>
      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        filters={filters}
        onFiltersChange={(f) => { setFilters(f); setPage(1); }}
        onClose={() => setFilterDrawerOpen(false)}
        onClear={clearFilters}
      />

      {/* Toolbar row */}
      <div className="flex items-center justify-between mb-8 gap-4">
        {/* Filter trigger */}
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3 text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            border: `1px solid ${activeFilterCount > 0 ? 'var(--gold)' : 'var(--line)'}`,
            background: activeFilterCount > 0 ? 'rgba(200,164,92,0.06)' : 'transparent',
            color: activeFilterCount > 0 ? 'var(--cream)' : 'var(--cream-dim)',
            cursor: 'pointer',
            fontFamily: 'Jost',
            letterSpacing: '0.18em',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = activeFilterCount > 0 ? 'var(--gold)' : 'var(--line)'}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        <div className="flex items-center gap-4">
          {/* Product count */}
          <p className="text-xs hidden sm:block" style={{ color: 'var(--cream-dim)' }}>
            {isLoading ? '…' : `${meta?.total ?? 0} products`}
          </p>

          {/* Sort */}
          <div style={{ border: '1px solid var(--line)' }}>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="text-xs px-4 py-3 outline-none"
              style={{ background: 'var(--ink-soft)', color: 'var(--cream)', fontFamily: 'Jost', cursor: 'pointer', letterSpacing: '0.06em' }}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.badge && (
            <button
              onClick={() => setFilters((f) => ({ ...f, badge: undefined }))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all duration-200"
              style={{ background: 'rgba(200,164,92,0.1)', border: '1px solid var(--gold)', color: 'var(--gold)', cursor: 'pointer', fontFamily: 'Jost' }}
            >
              {filters.badge}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <button
              onClick={() => setFilters((f) => ({ ...f, minPrice: undefined, maxPrice: undefined }))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all duration-200"
              style={{ background: 'rgba(200,164,92,0.1)', border: '1px solid var(--gold)', color: 'var(--gold)', cursor: 'pointer', fontFamily: 'Jost' }}
            >
              ${filters.minPrice ?? 0} – ${filters.maxPrice ?? '∞'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '3/4', border: '1px solid var(--line)' }} />
          ))}
        </div>
      ) : isError ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl mb-3" style={{ color: 'var(--cream)' }}>Unable to load products</p>
          <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>The server is currently unavailable. Please try again shortly.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl mb-3" style={{ color: 'var(--cream)' }}>No products found</p>
          <p className="text-sm mb-5" style={{ color: 'var(--cream-dim)' }}>Try adjusting your filters.</p>
          <button onClick={clearFilters} className="btn-ghost text-xs px-6 py-3">Clear filters</button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate="show"
          key={JSON.stringify(query)}
        >
          {products.map((p: any, i: number) => (
            <motion.div
              key={p.id}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.04, ease }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center text-sm transition-all duration-300 disabled:opacity-30"
            style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--cream-dim)', cursor: 'pointer' }}
          >
            ‹
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
            .filter((pg) => Math.abs(pg - page) <= 2)
            .map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className="w-9 h-9 text-xs font-medium transition-all duration-300"
                style={{
                  border: '1px solid var(--line)',
                  background: pg === page ? 'var(--gold)' : 'transparent',
                  color: pg === page ? 'var(--ink)' : 'var(--cream-dim)',
                  cursor: 'pointer',
                  fontFamily: 'Jost',
                }}
              >
                {pg}
              </button>
            ))}
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="w-9 h-9 flex items-center justify-center text-sm transition-all duration-300 disabled:opacity-30"
            style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--cream-dim)', cursor: 'pointer' }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
