'use client';

import Link from 'next/link';

const SHOP_LINKS = [
  { label: 'New arrivals',  href: '/products?sort=newest' },
  { label: 'Lighting',      href: '/products?category=lighting' },
  { label: 'Ceramics',      href: '/products?category=decor-objects' },
  { label: 'Textiles',      href: '/products?category=textiles' },
];

const HELP_LINKS = [
  { label: 'Shipping & returns', href: '/terms#shipping' },
  { label: 'Track your order',   href: '/account/orders' },
  { label: 'Afterpay & Zip',     href: '/terms#afterpay' },
  { label: 'Contact',            href: 'mailto:support@sapphirevibes.com.au' },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Main columns ──────────────────────────── */}
      <div className="container-page pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10">

          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="font-serif text-[1.9rem] font-semibold inline-block mb-5"
              style={{ color: 'var(--cream)' }}
            >
              Sapphire<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Vibes</span>
            </Link>
            <p
              className="text-[0.88rem] leading-relaxed mb-6"
              style={{ color: 'var(--cream-dim)', maxWidth: 300 }}
            >
              Considered home décor, shipped free across Australia.
              Afterpay and Zip available. All prices GST inclusive.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {[
                { label: 'Instagram', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                ) },
                { label: 'Pinterest', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.19-.77 1.27-5.39 1.27-5.39s-.32-.65-.32-1.61c0-1.51.88-2.64 1.97-2.64.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.91 3.64-.26 1.09.54 1.97 1.61 1.97 1.93 0 3.42-2.04 3.42-4.97 0-2.6-1.87-4.42-4.54-4.42-3.09 0-4.9 2.32-4.9 4.71 0 .93.36 1.93.81 2.48.09.11.1.2.07.31l-.3 1.23c-.05.2-.16.24-.37.14-1.39-.65-2.26-2.68-2.26-4.32 0-3.51 2.55-6.74 7.36-6.74 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.91-5.76 6.91-1.12 0-2.18-.58-2.54-1.27l-.69 2.58c-.25.97-.93 2.18-1.39 2.92.96.27 1.97.41 3.02.41 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                ) },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex items-center justify-center transition-colors duration-300"
                  style={{ color: 'var(--cream-dim)', width: 32, height: 32 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)')}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { heading: 'Shop', links: SHOP_LINKS },
            { heading: 'Help', links: HELP_LINKS },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4
                className="text-[0.68rem] font-semibold tracking-[0.24em] uppercase mb-5"
                style={{ color: 'var(--gold)' }}
              >
                {heading}
              </h4>
              <ul className="list-none space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[0.875rem] transition-colors duration-300"
                      style={{ color: 'var(--cream-dim)' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 md:px-8 py-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <p className="text-[0.75rem]" style={{ color: 'var(--cream-dim)' }}>
          © 2026 SapphireVibes. All prices in AUD, GST inclusive.
        </p>
        <p className="text-[0.75rem]" style={{ color: 'var(--cream-dim)' }}>
          Free AU shipping · 30-day returns · Secure checkout
        </p>
      </div>
    </footer>
  );
}
