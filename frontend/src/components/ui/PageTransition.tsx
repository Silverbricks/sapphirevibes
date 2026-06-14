'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { fadeUp, PAGE, ease } from '@/lib/motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: PAGE, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
