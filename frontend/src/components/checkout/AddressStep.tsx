'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CheckoutAddress } from './CheckoutClient';

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  line1: z.string().min(5, 'Street address is required'),
  line2: z.string().optional(),
  suburb: z.string().min(2, 'Suburb is required'),
  state: z.string().min(2, 'State is required'),
  postcode: z.string().regex(/^\d{4}$/, '4-digit postcode required'),
  country: z.string().default('AU'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initial: CheckoutAddress | null;
  onNext: (addr: CheckoutAddress) => void;
}

export function AddressStep({ initial, onNext }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { country: 'AU' },
  });

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: 'var(--cream)' }}>Delivery Address</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--cream-dim)' }}>Where should we send your order?</p>
      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        <Field label="Full name" error={errors.fullName?.message}>
          <Input {...register('fullName')} placeholder="Priya Singh" autoComplete="name" />
        </Field>

        <Field label="Phone" error={errors.phone?.message}>
          <Input {...register('phone')} type="tel" placeholder="04XX XXX XXX" autoComplete="tel" />
        </Field>

        <Field label="Street address" error={errors.line1?.message}>
          <Input {...register('line1')} placeholder="12 Acacia Avenue" autoComplete="address-line1" />
        </Field>

        <Field label="Unit / Apt (optional)" error={errors.line2?.message}>
          <Input {...register('line2')} placeholder="Unit 3" autoComplete="address-line2" />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 sm:col-span-1">
            <Field label="Suburb" error={errors.suburb?.message}>
              <Input {...register('suburb')} placeholder="Fitzroy" autoComplete="address-level2" />
            </Field>
          </div>
          <Field label="State" error={errors.state?.message}>
            <select
              {...register('state')}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--ink)', border: '1px solid var(--line)', color: 'var(--cream)', fontFamily: 'Jost' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
            >
              <option value="">State</option>
              {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Postcode" error={errors.postcode?.message}>
            <Input {...register('postcode')} placeholder="3000" autoComplete="postal-code" maxLength={4} />
          </Field>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 disabled:opacity-60"
          style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: isSubmitting ? 'wait' : 'pointer', fontFamily: 'Jost', letterSpacing: '0.22em' }}
          onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-bright)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
        >
          {isSubmitting ? 'Saving…' : 'Continue to Payment →'}
        </button>
      </form>
    </div>
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
      className="w-full px-4 py-3 text-sm outline-none"
      style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', fontFamily: 'Jost' }}
      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--gold)'; props.onFocus?.(e); }}
      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--line)'; props.onBlur?.(e); }}
    />
  );
}
