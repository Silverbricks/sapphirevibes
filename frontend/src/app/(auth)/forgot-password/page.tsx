'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      toast('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-[2rem] font-semibold" style={{ color: 'var(--cream)' }}>
            Sapphire<span style={{ color: 'var(--gold)' }}>Vibes</span>
          </Link>
        </div>

        <div style={{ border: '1px solid var(--line)', padding: '36px', background: 'var(--ink-soft)' }}>
          {sent ? (
            <div className="text-center">
              <div className="text-3xl mb-4">✉️</div>
              <h2 className="font-serif text-xl mb-3" style={{ color: 'var(--cream)' }}>Check your inbox</h2>
              <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                We sent a reset link to <b style={{ color: 'var(--gold)' }}>{email}</b>. Check your spam if you don't see it.
              </p>
              <Link href="/login" className="inline-block mt-6 text-xs tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>
                Back to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <h2 className="font-serif text-xl mb-2" style={{ color: 'var(--cream)' }}>Reset your password</h2>
                <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
                  Enter your email and we'll send a reset link.
                </p>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com.au"
                  required
                  className="w-full px-4 py-3 text-sm outline-none"
                  style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', fontFamily: 'Jost' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-xs tracking-widest uppercase font-semibold disabled:opacity-60"
                style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.22em' }}
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>

              <div className="text-center">
                <Link href="/login" className="text-xs" style={{ color: 'var(--cream-dim)' }}>← Back to sign in</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
