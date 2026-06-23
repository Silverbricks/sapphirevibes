'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RatingWidget } from './RatingWidget';
import { feedbackService } from '@/services/feedback.service';
import { STD, ease } from '@/lib/motion';

const CATEGORIES = [
  { key: 'quality', label: 'Quality' },
  { key: 'service', label: 'Service' },
  { key: 'value', label: 'Value' },
  { key: 'experience', label: 'Experience' },
];

const MAX_COMMENT = 500;

type Status = 'idle' | 'pending' | 'success' | 'error';

interface Props {
  targetId: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function FeedbackForm({ targetId, onSuccess, compact }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const charsLeft = MAX_COMMENT - comment.length;
  const canSubmit = rating > 0 && status !== 'pending';

  function toggleCategory(key: string) {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('pending');
    setErrorMsg('');

    try {
      await feedbackService.create({ targetId, rating, comment: comment || undefined, categories: selectedCategories });
      setStatus('success');
      setRating(0);
      setComment('');
      setSelectedCategories([]);
      onSuccess?.();
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: STD, ease }}
        className="text-center py-8"
      >
        {/* Animated checkmark */}
        <svg viewBox="0 0 52 52" width={52} height={52} style={{ display: 'block', margin: '0 auto 12px' }}>
          <motion.circle
            cx="26" cy="26" r="24"
            fill="none" stroke="var(--gold)" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease }}
          />
          <motion.path
            fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M14 27l8 8 16-16"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease }}
          />
        </svg>
        <p style={{ color: 'var(--cream)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>Thank you for your feedback!</p>
        <button
          onClick={() => setStatus('idle')}
          style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.1em', textDecoration: 'underline' }}
        >
          Leave another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Star rating */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 8 }}>
          Your rating <span style={{ color: '#e25c3e' }}>*</span>
        </div>
        <RatingWidget value={rating} onChange={setRating} size="lg" />
        {rating === 0 && status === 'error' && (
          <p style={{ color: '#e25c3e', fontSize: '0.74rem', marginTop: 4 }}>Please select a rating</p>
        )}
      </div>

      {/* Category chips */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 8 }}>Category (optional)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.key}
              type="button"
              onClick={() => toggleCategory(cat.key)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '5px 14px',
                border: `1px solid ${selectedCategories.includes(cat.key) ? 'var(--gold)' : 'var(--line)'}`,
                background: selectedCategories.includes(cat.key) ? 'rgba(200,164,92,.12)' : 'transparent',
                color: selectedCategories.includes(cat.key) ? 'var(--gold)' : 'var(--cream-dim)',
                fontSize: '0.76rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comment */}
      {!compact && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Comment (optional)</span>
            <span style={{ fontSize: '0.72rem', color: charsLeft < 50 ? '#e67e22' : 'var(--cream-dim)' }}>
              {charsLeft} left
            </span>
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, MAX_COMMENT))}
            placeholder="Share your experience…"
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', background: 'var(--ink)', border: '1px solid var(--line)',
              color: 'var(--cream)', fontSize: '0.88rem', outline: 'none', resize: 'vertical',
              minHeight: 80, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(200,164,92,.5)')}
            onBlur={e => (e.target.style.borderColor = 'var(--line)')}
          />
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#e25c3e', fontSize: '0.78rem', marginBottom: 12 }}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileTap={canSubmit ? { scale: 0.97 } : {}}
        style={{
          padding: '11px 28px',
          background: canSubmit ? 'var(--gold)' : 'var(--panel)',
          color: canSubmit ? 'var(--ink)' : 'var(--cream-dim)',
          border: 'none',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          fontSize: '0.76rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {status === 'pending' ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--ink)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
            Submitting…
          </>
        ) : 'Submit feedback'}
      </motion.button>
    </form>
  );
}
