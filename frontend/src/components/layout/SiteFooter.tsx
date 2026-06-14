import Link from 'next/link';

const SHOP_LINKS: { label: string; href: string }[] = [
  { label: 'New arrivals',  href: '/products?sort=newest' },
  { label: 'Lighting',      href: '/products?category=lighting' },
  { label: 'Ceramics',      href: '/products?category=decor-objects' },
  { label: 'Textiles',      href: '/products?category=textiles' },
];
const HELP_LINKS: { label: string; href: string }[] = [
  { label: 'Shipping & returns', href: '/terms#shipping' },
  { label: 'Track your order',   href: '/account/orders' },
  { label: 'Afterpay & Zip',     href: '/terms#afterpay' },
  { label: 'Contact',            href: 'mailto:support@sapphirevibes.com.au' },
];

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--ink)', borderTop: '1px solid var(--line)' }}>

      {/* ── Link columns ──────────────────────── */}
      <div className="container-page pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-8">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-[1.8rem] font-semibold inline-block mb-4"
              style={{ color: 'var(--cream)' }}
            >
              Sapphire<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Vibes</span>
            </Link>
            <p
              className="text-[0.88rem] leading-relaxed"
              style={{ color: 'var(--cream-dim)', maxWidth: 320 }}
            >
              Considered home décor, shipped free across Australia. Afterpay and Zip available, GST included.
            </p>
          </div>

          {/* Link columns */}
          {[
            { heading: 'Shop', links: SHOP_LINKS },
            { heading: 'Help', links: HELP_LINKS },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4
                className="text-[0.7rem] font-medium tracking-[0.24em] uppercase mb-4"
                style={{ color: 'var(--gold)' }}
              >
                {heading}
              </h4>
              <ul className="list-none space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[0.88rem] transition-colors duration-300 hover:text-[var(--cream)]"
                      style={{ color: 'var(--cream-dim)' }}
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

      {/* ── Bottom strip ──────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 md:px-8 py-[14px]"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <p className="text-[0.76rem] tracking-wide" style={{ color: 'var(--cream-dim)' }}>
          © 2026 SapphireVibes. All prices in AUD, GST inclusive.
        </p>
        <p className="text-[0.76rem] tracking-wide" style={{ color: 'var(--cream-dim)' }}>
          Free AU shipping&nbsp;·&nbsp;30-day returns&nbsp;·&nbsp;Secure checkout
        </p>
      </div>

    </footer>
  );
}
