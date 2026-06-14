'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useState } from 'react';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { referralCode: searchParams.get('ref') ?? '' },
  });

  async function onSubmit({ confirmPassword, ...values }: FormData) {
    setLoading(true);
    try {
      const result = await authService.register(values);
      setAuth(result.user, result.accessToken, result.refreshToken);
      toast('Account created! Welcome to SapphireVibes.');
      router.push('/account');
    } catch (err: any) {
      toast(err?.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" error={errors.firstName?.message}>
          <Input {...register('firstName')} placeholder="Priya" autoComplete="given-name" />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <Input {...register('lastName')} placeholder="Singh" autoComplete="family-name" />
        </Field>
      </div>

      <Field label="Email address" error={errors.email?.message}>
        <Input {...register('email')} type="email" placeholder="you@example.com.au" autoComplete="email" />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <Input {...register('password')} type="password" placeholder="••••••••" autoComplete="new-password" />
      </Field>

      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <Input {...register('confirmPassword')} type="password" placeholder="••••••••" autoComplete="new-password" />
      </Field>

      <Field label="Referral code (optional)" error={errors.referralCode?.message}>
        <Input {...register('referralCode')} placeholder="ABC123" />
      </Field>

      <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>
        By creating an account you agree to our{' '}
        <a href="/terms" style={{ color: 'var(--gold)' }}>Terms</a> and{' '}
        <a href="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</a>.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-60"
        style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'Jost', letterSpacing: '0.22em' }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.16em' }}>{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 text-sm outline-none transition-colors duration-300"
      style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', fontFamily: 'Jost' }}
      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--gold)'; props.onFocus?.(e); }}
      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--line)'; props.onBlur?.(e); }}
    />
  );
}
