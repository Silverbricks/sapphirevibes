'use client';

const BADGES = [
  { value: 'HOT', label: '🔥 Hot' },
  { value: 'NEW', label: '🆕 New' },
  { value: 'TRENDING', label: '⭐ Trending' },
  { value: 'FESTIVAL', label: '🎉 Festival' },
  { value: 'SALE', label: '💸 Sale' },
];

const PRICE_RANGES = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: '$200 – $400', min: 200, max: 400 },
  { label: 'Over $400', min: 400, max: undefined },
];

interface Props {
  query: any;
  onChange: (updates: any) => void;
}

export function ProductFilters({ query, onChange }: Props) {
  return (
    <div className="space-y-8">
      {/* Badge filter */}
      <div>
        <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>Collection</h3>
        <ul className="space-y-2">
          {BADGES.map((b) => (
            <li key={b.value}>
              <button
                onClick={() => onChange({ badge: query.badge === b.value ? undefined : b.value })}
                className="text-sm w-full text-left transition-colors duration-300"
                style={{ color: query.badge === b.value ? 'var(--gold)' : 'var(--cream-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={(e) => { if (query.badge !== b.value) (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)'; }}
                onMouseLeave={(e) => { if (query.badge !== b.value) (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)'; }}
              >
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price filter */}
      <div>
        <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>Price (AUD)</h3>
        <ul className="space-y-2">
          {PRICE_RANGES.map((r) => {
            const active = query.minPrice === r.min && query.maxPrice === r.max;
            return (
              <li key={r.label}>
                <button
                  onClick={() => onChange(active ? { minPrice: undefined, maxPrice: undefined } : { minPrice: r.min, maxPrice: r.max })}
                  className="text-sm w-full text-left transition-colors duration-300"
                  style={{ color: active ? 'var(--gold)' : 'var(--cream-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {r.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Clear filters */}
      {(query.badge || query.minPrice) && (
        <button
          onClick={() => onChange({ badge: undefined, minPrice: undefined, maxPrice: undefined })}
          className="text-xs tracking-widest uppercase"
          style={{ color: 'var(--cream-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.2em' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)')}
        >
          Clear filters ×
        </button>
      )}
    </div>
  );
}
