const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" className="w-8 h-8 mb-4">
        <path d="M3 9l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    title: 'View in your room',
    desc: 'AR preview & true-to-scale dimensions before you buy.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" className="w-8 h-8 mb-4">
        <path d="M5 12l5 5L20 7" />
      </svg>
    ),
    title: 'Notify when back',
    desc: 'One tap to be alerted the moment a piece restocks.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" className="w-8 h-8 mb-4">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    title: 'Pay your way',
    desc: 'Afterpay, Zip, Apple & Google Pay — GST included.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" className="w-8 h-8 mb-4">
        <path d="M21 12a9 9 0 11-6.2-8.6" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
    title: '30-day returns',
    desc: 'Australian support, easy returns, considered packaging.',
  },
];

export function ValueProps() {
  return (
    <section className="pb-28">
      <div className="container-page">
        <div
          className="value-grid grid grid-cols-2 md:grid-cols-4 reveal"
          style={{ border: '1px solid var(--line)' }}
        >
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="py-10 px-8 text-center"
            >
              {v.icon}
              <h3 className="font-serif text-xl font-semibold mb-1.5" style={{ color: 'var(--cream)' }}>
                {v.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
