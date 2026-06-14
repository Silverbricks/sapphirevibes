'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, ease } from '@/lib/motion';

const REVIEWS = [
  {
    rating: 5,
    quote: '"The brass wall art is even more striking in person. Packaging was immaculate and it arrived in three days."',
    name: 'Priya R.',
    location: 'Melbourne',
  },
  {
    rating: 5,
    quote: '"Used the AR preview to check the mirror against my hallway — fit perfectly. No guesswork, no returns."',
    name: 'Daniel K.',
    location: 'Sydney',
  },
  {
    rating: 5,
    quote: '"Bought the whole styled look for our new living room. Everything tied together beautifully. Afterpay made it easy."',
    name: 'Aisha M.',
    location: 'Brisbane',
  },
];

export function CustomerReviews() {
  return (
    <section id="reviews" className="py-28">
      <div className="container-page">
        <div className="text-center mb-14 reveal">
          <span className="eyebrow">Verified customer photos</span>
          <h2 className="font-serif font-medium mt-3.5 mb-2.5" style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>
            Seen in real Australian homes
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--cream-dim)', letterSpacing: '0.05em' }}>
            <b style={{ color: 'var(--gold-bright)' }}>★ 4.9</b> from{' '}
            <b style={{ color: 'var(--gold-bright)' }}>1,240+</b> verified reviews
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {REVIEWS.map((r, i) => (
            <motion.article
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              style={{ border: '1px solid var(--line)', padding: 30, background: 'var(--ink-soft)' }}
            >
              {/* Photo placeholder */}
              <div
                className="mb-5 -mx-[30px] -mt-[30px]"
                style={{
                  aspectRatio: '16/9',
                  background: 'linear-gradient(135deg,#2a333f,#161b23)',
                  borderBottom: '1px solid var(--line)',
                }}
              />
              {/* Stars */}
              <div className="mb-3.5" style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: 2 }}>
                {'★'.repeat(r.rating)}
              </div>
              <p className="font-serif italic leading-[1.4]" style={{ fontSize: '1.32rem', color: 'var(--cream)' }}>
                {r.quote}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="w-[38px] h-[38px] rounded-full flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,var(--gold),#7a6234)' }}
                />
                <div>
                  <b style={{ fontSize: '0.86rem', fontWeight: 500, fontFamily: 'Jost' }}>{r.name}</b>
                  <br />
                  <span style={{ fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Verified · {r.location}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
