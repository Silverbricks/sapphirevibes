'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');

  function subscribe() {
    if (email && email.includes('@')) {
      toast.success('Welcome to the Edit');
      setEmail('');
    } else {
      toast.error('Enter a valid email address');
    }
  }

  return (
    <section
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        padding: 'clamp(72px, 10vw, 120px) 0',
      }}
    >
      <div className="max-w-[580px] mx-auto px-8 text-center reveal">
        <span className="eyebrow mb-4 inline-block">The SapphireVibes Edit</span>
        <h2
          className="font-serif font-semibold mb-4"
          style={{
            fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
            color: 'var(--cream)',
            lineHeight: 1.15,
          }}
        >
          First looks, festival drops &amp; styling notes
        </h2>
        <p
          className="mb-8 text-[0.95rem] leading-relaxed"
          style={{ color: 'var(--cream-dim)' }}
        >
          Join the list for early access to limited collections and member-only pricing.
        </p>

        <div
          className="flex max-w-[440px] mx-auto"
          style={{ border: '1px solid rgba(0,0,0,0.15)' }}
        >
          <input
            type="email"
            placeholder="your@email.com.au"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && subscribe()}
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-[0.9rem]"
            style={{ color: 'var(--cream)' }}
          />
          <button
            onClick={subscribe}
            className="px-7 text-[0.7rem] tracking-widest uppercase font-semibold transition-colors duration-300"
            style={{
              background: 'var(--gold)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              letterSpacing: '0.2em',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--muted-gold)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)')}
          >
            Subscribe
          </button>
        </div>

        <p className="mt-4 text-[0.72rem]" style={{ color: 'var(--cream-dim)' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
