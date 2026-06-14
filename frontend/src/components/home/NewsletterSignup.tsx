'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');

  function subscribe() {
    if (email && email.includes('@')) {
      toast('Welcome to the Edit');
      setEmail('');
    } else {
      toast('Enter a valid email');
    }
  }

  return (
    <section style={{ background: 'var(--ink-soft)', borderTop: '1px solid var(--line)', padding: '110px 0' }}>
      <div className="max-w-[580px] mx-auto px-8 text-center reveal">
        <span className="eyebrow">The SapphireVibes Edit</span>
        <h2 className="font-serif font-medium mt-3.5 mb-3" style={{ fontSize: 'clamp(2rem,3.6vw,2.8rem)' }}>
          First looks, festival drops &amp; styling notes
        </h2>
        <p className="mb-8" style={{ color: 'var(--cream-dim)' }}>
          Join the list for early access to limited collections and member-only pricing.
        </p>
        <div
          className="flex max-w-[440px] mx-auto"
          style={{ border: '1px solid var(--line)' }}
        >
          <input
            type="email"
            placeholder="your@email.com.au"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && subscribe()}
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-[0.9rem]"
            style={{ color: 'var(--cream)', fontFamily: 'Jost' }}
          />
          <button
            onClick={subscribe}
            className="px-7 text-[0.72rem] tracking-widest uppercase font-semibold transition-colors duration-300"
            style={{
              background: 'var(--gold)',
              border: 'none',
              color: 'var(--ink)',
              fontFamily: 'Jost',
              cursor: 'pointer',
              letterSpacing: '0.2em',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)')}
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
