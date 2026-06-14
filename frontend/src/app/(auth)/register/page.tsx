import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Create Account — SapphireVibes' };

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--ink)' }}
    >
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-[2rem] font-semibold" style={{ color: 'var(--cream)' }}>
            Sapphire<span style={{ color: 'var(--gold)' }}>Vibes</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--cream-dim)' }}>
            Create your account and earn <span style={{ color: 'var(--gold)' }}>200 welcome points</span>
          </p>
        </div>

        <div style={{ border: '1px solid var(--line)', padding: '36px', background: 'var(--ink-soft)' }}>
          <Suspense fallback={<div style={{ color: 'var(--cream-dim)', textAlign: 'center', padding: 24 }}>Loading…</div>}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--cream-dim)' }}>
          Already have an account?{' '}
          <Link href="/login" className="transition-colors duration-300" style={{ color: 'var(--gold)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
