import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — SapphireVibes',
  description: 'SapphireVibes curates considered home décor for the Australian home — pieces chosen for the way they age, not the way they trend.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Hero */}
      <div className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="container-page max-w-[820px]">
          <p className="eyebrow mb-6">Our story</p>
          <h1
            className="font-serif font-medium mb-6"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
            }}
          >
            Décor chosen for how it{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>ages</em>,<br />
            not how it trends.
          </h1>
          <p className="text-[1rem] leading-relaxed max-w-[560px]" style={{ color: 'var(--cream-dim)' }}>
            SapphireVibes began with a single conviction: that the objects we bring into our homes should earn their place quietly, year after year. We curate a small, deliberate collection — lighting, ceramics, textiles, and objects — from makers who share that belief.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="section-pad">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Small by design',
                body: 'We carry fewer than 150 pieces at any one time. Every product is here because it earned its place, not because it filled a quota.',
              },
              {
                title: 'Australian-focused',
                body: 'Designed for Australian light, scale, and climate. Free shipping nationwide, GST included, Afterpay available.',
              },
              {
                title: 'Built to last',
                body: 'We favour natural materials — stone, linen, ceramic, brass — that develop character rather than deteriorate.',
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
                <h3 className="font-serif text-xl mb-3" style={{ color: 'var(--cream)' }}>{title}</h3>
                <p className="text-[0.9rem] leading-relaxed" style={{ color: 'var(--cream-dim)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section-pad text-center" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container-page">
          <p className="eyebrow mb-4">Ready to explore?</p>
          <h2 className="h2 mb-6" style={{ color: 'var(--cream)' }}>Shop the collection</h2>
          <Link href="/products" className="btn-gold px-10 py-4 text-[0.78rem] tracking-[0.18em]">
            Browse all pieces
          </Link>
        </div>
      </div>
    </div>
  );
}
