'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type Props = HTMLMotionProps<'button'> & { className?: string };

export function MotionButton({ children, className, ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ filter: 'brightness(1.08)' }}
      transition={{ duration: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
