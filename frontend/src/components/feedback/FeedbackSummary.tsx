'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { feedbackService } from '@/services/feedback.service';
import { RatingWidget } from './RatingWidget';
import { ease } from '@/lib/motion';

interface Props { targetId: string }

export function FeedbackSummary({ targetId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['feedback-summary', targetId],
    queryFn: () => feedbackService.getSummary(targetId),
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return <div style={{ height: 80, background: 'var(--ink-soft)', border: '1px solid var(--line)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
  }

  if (!data || data.count === 0) return null;

  const { average, count, distribution } = data;

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', fontFamily: 'Inter, sans-serif' }}>
      {/* Big average */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: 500, color: 'var(--cream)', lineHeight: 1 }}>
          {average.toFixed(1)}
        </div>
        <RatingWidget value={Math.round(average)} onChange={() => {}} readonly size="sm" />
        <div style={{ fontSize: '0.72rem', color: 'var(--cream-dim)', marginTop: 4, letterSpacing: '0.1em' }}>
          {count} rating{count !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Distribution histogram */}
      <div style={{ flex: 1, minWidth: 180 }}>
        {[5, 4, 3, 2, 1].map(star => {
          const n = distribution[star] ?? 0;
          const pct = count > 0 ? (n / count) * 100 : 0;
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--cream-dim)', width: 14, textAlign: 'right', flexShrink: 0 }}>{star}</span>
              <svg viewBox="0 0 24 10" width={14} height={10} style={{ flexShrink: 0 }}>
                <path d="M12 1l2.47 4.99L20 6.87l-4 3.9.94 5.5L12 13.77l-4.94 2.5.94-5.5-4-3.9 5.53-.88z" fill="var(--gold)" />
              </svg>
              <div style={{ flex: 1, height: 6, background: 'var(--panel)', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'var(--gold)', borderRadius: 2 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease, delay: (5 - star) * 0.05 }}
                />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--cream-dim)', width: 18, textAlign: 'right', flexShrink: 0 }}>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
