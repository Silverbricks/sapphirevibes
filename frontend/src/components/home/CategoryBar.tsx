import Link from 'next/link';

const CATEGORIES = [
  { name: 'Lighting',       count: 42, slug: 'lighting' },
  { name: 'Décor objects',  count: 68, slug: 'decor-objects' },
  { name: 'Living',         count: 31, slug: 'living' },
];

export function CategoryBar() {
  return (
    <section
      style={{
        background: 'var(--ink-soft)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="grid grid-cols-3">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center justify-center gap-3 py-10 transition-colors duration-300"
            style={{
              borderRight: i < CATEGORIES.length - 1 ? '1px solid var(--line)' : 'none',
            }}
          >
            {/* Thumbnail placeholder — replace with Next/Image when assets are ready */}
            <div
              className="w-11 h-[52px] rounded-sm flex items-center justify-center"
              style={{ border: '1.5px solid var(--line)', background: 'var(--panel)' }}
            >
              <svg
                className="w-4 h-4 opacity-30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--cream)"
                strokeWidth="1.2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>

            <h3
              className="font-serif text-[1.02rem] font-medium transition-colors duration-300 group-hover:text-[var(--gold)]"
              style={{ color: 'var(--cream)' }}
            >
              {cat.name}
            </h3>

            <p className="text-xs tracking-wide" style={{ color: 'var(--cream-dim)' }}>
              {cat.count} pieces
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
