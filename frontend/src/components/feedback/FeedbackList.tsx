'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackService, FeedbackItem } from '@/services/feedback.service';
import { RatingWidget } from './RatingWidget';
import { fadeUp, ease } from '@/lib/motion';

const CATEGORY_LABELS: Record<string, string> = {
  quality: 'Quality', service: 'Service', value: 'Value', experience: 'Experience',
};

type Sort = 'newest' | 'highest' | 'lowest';

interface Props { targetId: string }

export function FeedbackList({ targetId }: Props) {
  const [sort, setSort] = useState<Sort>('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery<{ data: FeedbackItem[]; total: number; pages: number }>({
    queryKey: ['feedback', targetId, sort, page],
    queryFn: () => feedbackService.list(targetId, page, sort),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev: any) => prev,
  } as any);

  const items: FeedbackItem[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const pages: number = data?.pages ?? 1;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>
          {total > 0 ? `${total} feedback submission${total !== 1 ? 's' : ''}` : 'No feedback yet'}
        </div>
        <select
          value={sort}
          onChange={e => { setSort(e.target.value as Sort); setPage(1); }}
          style={{ padding: '6px 12px', background: 'var(--ink)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.78rem', cursor: 'pointer', outline: 'none' }}
        >
          <option value="newest">Newest first</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
        </select>
      </div>

      {isLoading && (
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--cream-dim)', fontSize: '0.86rem' }}>Loading…</div>
      )}

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={`${sort}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {items.length === 0 && (
              <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--cream-dim)', fontSize: '0.86rem' }}>
                No feedback yet — be the first to share your experience.
              </div>
            )}
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.35, ease, delay: i * 0.05 }}
                style={{ marginBottom: 16, padding: '18px 20px', background: 'var(--ink-soft)', border: '1px solid var(--line)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <RatingWidget value={item.rating} onChange={() => {}} readonly size="sm" />
                  {item.userId && (
                    <span style={{ fontSize: '0.66rem', padding: '2px 7px', background: 'rgba(39,174,96,.12)', color: '#27ae60', border: '1px solid rgba(39,174,96,.25)' }}>
                      Verified
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', color: 'var(--cream-dim)', marginLeft: 'auto' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {item.categories.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: item.comment ? 10 : 0 }}>
                    {item.categories.map(cat => (
                      <span key={cat} style={{ fontSize: '0.66rem', padding: '2px 8px', background: 'rgba(200,164,92,.08)', color: 'var(--gold)', border: '1px solid var(--line)', letterSpacing: '0.1em' }}>
                        {CATEGORY_LABELS[cat] ?? cat}
                      </span>
                    ))}
                  </div>
                )}
                {item.comment && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--cream-dim)', lineHeight: 1.6, margin: 0 }}>
                    {item.comment}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
            style={{ padding: '6px 16px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.78rem' }}
          >
            ← Prev
          </button>
          <span style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--cream-dim)' }}>
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages || isFetching}
            style={{ padding: '6px 16px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: page === pages ? 'not-allowed' : 'pointer', fontSize: '0.78rem' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
