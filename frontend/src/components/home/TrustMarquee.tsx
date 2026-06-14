const ITEMS = [
  'Australian owned & operated',
  'Real-room AR preview',
  'GST-inclusive pricing',
  'Back-in-stock alerts',
  'Free returns within 30 days',
];

export function TrustMarquee() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden"
      style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}
    >
      <div
        className="trust-track flex gap-[70px] py-[18px] whitespace-nowrap"
        style={{ fontSize: '0.76rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3.5">
            <span style={{ color: 'var(--gold)' }}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
