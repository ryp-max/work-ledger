'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface LedgerPageProps {
  children: ReactNode;
}

export function LedgerPage({ children }: LedgerPageProps) {
  return (
    <motion.article
      className="bg-[var(--paper)] rounded-lg shadow-[var(--shadow-page)] p-8 lg:p-10 paper-grain"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.article>
  );
}
