const ITEMS = [
  { icon: 'shipping', text: 'Free AU shipping over $150' },
  { icon: 'returns',  text: '30-day hassle-free returns' },
  { icon: 'pay',      text: 'Afterpay · Zip · Klarna' },
  { icon: 'craft',    text: 'Authentic craftsmanship' },
  { icon: 'experts',  text: 'Curated by interior experts' },
  { icon: 'secure',   text: 'Secure checkout' },
];

function TrustIcon({ type }: { type: string }) {
  const cls = 'w-3.5 h-3.5 shrink-0';
  if (type === 'shipping') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
  if (type === 'returns') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
  if (type === 'pay') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </svg>
  );
  if (type === 'craft') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
  if (type === 'experts') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TrustItem({ item }: { item: typeof ITEMS[0] }) {
  return (
    <span
      className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap"
      style={{ color: 'var(--cream-dim)' }}
    >
      <TrustIcon type={item.icon} />
      <span className="text-[0.7rem] tracking-[0.18em] uppercase">
        {item.text}
      </span>
      <span className="text-[0.55rem] ml-3" style={{ color: 'var(--border-gold)' }}>✦</span>
    </span>
  );
}

export function TrustBar() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        height: 52,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="trust-track flex" aria-hidden="true">
        {repeated.map((item, i) => (
          <TrustItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
