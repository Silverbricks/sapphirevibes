'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--ink)' }}
    >
      <p className="eyebrow mb-4">Something went wrong</p>
      <h1 className="h2 mb-4" style={{ color: 'var(--cream)' }}>Unexpected error</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--cream-dim)', maxWidth: 380 }}>
        We&apos;re sorry — something broke on our end. Please try again or return home.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="btn-gold text-[0.78rem] tracking-[0.16em] px-8 py-3"
        >
          Try again
        </button>
        <a href="/" className="btn-ghost text-[0.78rem] tracking-[0.16em] px-8 py-3">
          Return home
        </a>
      </div>
    </div>
  );
}
