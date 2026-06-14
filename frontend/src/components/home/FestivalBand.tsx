'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const DIWALI_2026 = new Date('2026-10-20T00:00:00+10:00').getTime();

function useCountdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((DIWALI_2026 - Date.now()) / 1000)));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, Math.floor((DIWALI_2026 - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    days: pad(Math.floor(remaining / 86400)),
    hours: pad(Math.floor((remaining % 86400) / 3600)),
    minutes: pad(Math.floor((remaining % 3600) / 60)),
    seconds: pad(remaining % 60),
  };
}

export function FestivalBand() {
  const countdown = useCountdown();

  return (
    <section
      id="festival"
      style={{
        background: 'radial-gradient(80% 140% at 80% 0%,#2c2113 0%,transparent 60%), linear-gradient(180deg,#14100a,#0e1116)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        padding: '110px 0',
      }}
    >
      <div className="container-page grid md:grid-cols-2 gap-[60px] items-center">
        {/* Copy */}
        <div className="reveal">
          <span className="eyebrow">Festival Special · Limited Release</span>
          <h2
            className="font-serif font-medium leading-[1.02] my-5"
            style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)' }}
          >
            The{' '}
            <em className="italic" style={{ color: 'var(--gold)' }}>
              Diwali
            </em>{' '}
            Collection
          </h2>
          <p className="mb-7 max-w-[440px]" style={{ color: 'var(--cream-dim)' }}>
            Hand-finished brass, warm gold lighting, and statement centrepieces — curated for the
            season of light. Member early-access now open.
          </p>

          {/* Countdown */}
          <div className="flex gap-[18px] mb-9">
            {[
              { val: countdown.days, label: 'Days' },
              { val: countdown.hours, label: 'Hrs' },
              { val: countdown.minutes, label: 'Min' },
              { val: countdown.seconds, label: 'Sec' },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="text-center min-w-[72px] px-5 py-4"
                style={{
                  border: '1px solid var(--line)',
                  background: 'rgba(14,17,22,.5)',
                }}
              >
                <b
                  className="block font-serif font-semibold leading-none"
                  style={{ fontSize: '2.2rem', color: 'var(--gold-bright)' }}
                >
                  {val}
                </b>
                <span
                  className="text-[0.6rem] tracking-widest uppercase"
                  style={{ color: 'var(--cream-dim)', letterSpacing: '0.2em' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <button
            className="btn-gold"
            onClick={() => toast('Opening the Diwali Collection')}
          >
            Shop the collection
          </button>
        </div>

        {/* Art */}
        <div
          className="relative flex items-center justify-center reveal"
          style={{
            aspectRatio: '4/5',
            border: '1px solid var(--line)',
            background: 'radial-gradient(circle at 50% 30%,#3a2c17,#14100a)',
            overflow: 'hidden',
          }}
        >
          <div className="absolute rounded-full" style={{ width: '80%', height: '80%', border: '1px solid rgba(200,164,92,.3)' }} />
          <div className="absolute rounded-full" style={{ width: '55%', height: '55%', border: '1px solid rgba(200,164,92,.3)' }} />
          <div
            className="relative"
            style={{
              width: 120, height: 170,
              background: 'linear-gradient(180deg,var(--gold-bright),var(--gold))',
              borderRadius: '50% 50% 12% 12%',
              boxShadow: '0 0 70px rgba(228,200,132,.45)',
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                inset: -30,
                background: 'radial-gradient(circle,rgba(228,200,132,.4),transparent 70%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
