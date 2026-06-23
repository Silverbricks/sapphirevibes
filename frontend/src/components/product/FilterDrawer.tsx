'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ease, STD } from '@/lib/motion';

const BADGES = ['HOT', 'NEW', 'TRENDING', 'FESTIVAL', 'SALE'];
const PRICE_RANGES = [
  { label: 'Under $100',    min: 0,   max: 100 },
  { label: '$100 – $200',   min: 100, max: 200 },
  { label: '$200 – $400',   min: 200, max: 400 },
  { label: '$400+',         min: 400, max: undefined },
];

interface FilterState {
  badge?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface Props {
  open: boolean;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onClose: () => void;
  onClear: () => void;
}

export function FilterDrawer({ open, filters, onFiltersChange, onClose, onClear }: Props) {
  const activeRange = PRICE_RANGES.find(
    (r) => r.min === filters.minPrice && r.max === filters.maxPrice,
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{ zIndex: 49 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col"
            style={{
              width: 'min(340px, 90vw)',
              background: 'var(--charcoal)',
              borderRight: '1px solid var(--line)',
              boxShadow: '40px 0 80px rgba(0,0,0,0.45)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <h2 className="font-serif text-lg font-medium" style={{ color: 'var(--cream)' }}>
                Filters
              </h2>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-dim)', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close filters"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* Badge / Collection filter */}
              <div>
                <h3 className="text-[0.65rem] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.28em' }}>
                  Collection
                </h3>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map((b) => {
                    const active = filters.badge === b;
                    return (
                      <button
                        key={b}
                        onClick={() => onFiltersChange({ ...filters, badge: active ? undefined : b })}
                        className="px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase transition-all duration-200"
                        style={{
                          border: `1px solid ${active ? 'var(--gold)' : 'var(--line)'}`,
                          background: active ? 'var(--gold)' : 'transparent',
                          color: active ? 'var(--ink)' : 'var(--cream-dim)',
                          cursor: 'pointer',
                          fontFamily: 'Inter',
                          letterSpacing: '0.18em',
                        }}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="text-[0.65rem] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.28em' }}>
                  Price Range
                </h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((r) => {
                    const active = activeRange === r;
                    return (
                      <button
                        key={r.label}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            minPrice: active ? undefined : r.min,
                            maxPrice: active ? undefined : r.max,
                          })
                        }
                        className="flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200 text-left"
                        style={{
                          border: `1px solid ${active ? 'var(--gold)' : 'var(--line)'}`,
                          background: active ? 'rgba(200,164,92,0.08)' : 'transparent',
                          color: active ? 'var(--cream)' : 'var(--cream-dim)',
                          cursor: 'pointer',
                          fontFamily: 'Inter',
                        }}
                      >
                        {r.label}
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom price inputs */}
              <div>
                <h3 className="text-[0.65rem] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.28em' }}>
                  Custom Price
                </h3>
                <div className="flex gap-3 items-center">
                  <div className="flex-1" style={{ border: '1px solid var(--line)' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      min={0}
                      value={filters.minPrice ?? ''}
                      onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2.5 text-sm bg-transparent outline-none"
                      style={{ color: 'var(--cream)', fontFamily: 'Inter' }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--cream-dim)' }}>–</span>
                  <div className="flex-1" style={{ border: '1px solid var(--line)' }}>
                    <input
                      type="number"
                      placeholder="Max"
                      min={0}
                      value={filters.maxPrice ?? ''}
                      onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2.5 text-sm bg-transparent outline-none"
                      style={{ color: 'var(--cream)', fontFamily: 'Inter' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="shrink-0 px-6 py-5 flex gap-3" style={{ borderTop: '1px solid var(--line)' }}>
              <button
                onClick={onClear}
                className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  color: 'var(--cream-dim)',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  letterSpacing: '0.2em',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)'; }}
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="flex-[2] py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-200 hover:brightness-110"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--ink)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  letterSpacing: '0.2em',
                }}
              >
                Apply filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
