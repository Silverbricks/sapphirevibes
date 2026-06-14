'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const SIZE = { sm: 18, md: 26, lg: 36 };

export function RatingWidget({ value, onChange, size = 'md', readonly = false }: Props) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const px = SIZE[size];

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={readonly ? `Rating: ${value} out of 5` : 'Select a rating'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          aria-pressed={value === star}
          disabled={readonly}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          whileTap={readonly ? {} : { scale: 0.85 }}
          whileHover={readonly ? {} : { scale: 1.12 }}
          transition={{ duration: 0.12 }}
          style={{
            background: 'none',
            border: 'none',
            cursor: readonly ? 'default' : 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
        >
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill={star <= active ? 'var(--gold)' : 'none'}
            stroke={star <= active ? 'var(--gold)' : 'var(--cream-dim)'}
            strokeWidth="1.5"
            style={{ transition: 'fill 0.15s, stroke 0.15s' }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.button>
      ))}
    </div>
  );
}
