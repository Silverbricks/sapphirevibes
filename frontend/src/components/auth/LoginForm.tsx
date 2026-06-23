'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      const result = await authService.login(values);
      setAuth(result.user, result.accessToken, result.refreshToken);
      toast('Welcome back!');
      router.push(result.user.role === 'ADMIN' ? '/admin' : '/account');
    } catch (err: any) {
      toast(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Email address" error={errors.email?.message}>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          placeholder="you@example.com.au"
          className="w-full px-4 py-3 text-sm outline-none transition-colors duration-300"
          style={{
            background: 'transparent',
            border: '1px solid var(--line)',
            color: 'var(--cream)',
            fontFamily: 'Inter',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input
          {...register('password')}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 text-sm outline-none transition-colors duration-300"
          style={{
            background: 'transparent',
            border: '1px solid var(--line)',
            color: 'var(--cream)',
            fontFamily: 'Inter',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-60"
        style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Inter', letterSpacing: '0.22em' }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ borderTop: '1px solid var(--line)' }} />
        </div>
        <div className="relative flex justify-center text-xs" style={{ color: 'var(--cream-dim)' }}>
          <span className="px-3" style={{ background: 'var(--ink-soft)' }}>or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full py-3.5 text-xs tracking-widest uppercase transition-all duration-300"
        style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer', fontFamily: 'Inter', letterSpacing: '0.16em' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-dim)'; }}
        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
            <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
            <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
            <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          Continue with Google
        </span>
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  );
}
