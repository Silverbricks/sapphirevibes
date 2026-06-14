import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign In — SapphireVibes' };

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--ink)' }}
    >
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-[2rem] font-semibold" style={{ color: 'var(--cream)' }}>
            Sapphire<span style={{ color: 'var(--gold)' }}>Vibes</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--cream-dim)' }}>
            Sign in to your account
          </p>
        </div>

        <div style={{ border: '1px solid var(--line)', padding: '36px', background: 'var(--ink-soft)' }}>
          <LoginForm />

          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-xs tracking-wide transition-colors duration-300"
              style={{ color: 'var(--cream-dim)' }}
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--cream-dim)' }}>
          New to SapphireVibes?{' '}
          <Link href="/register" className="transition-colors duration-300" style={{ color: 'var(--gold)' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
