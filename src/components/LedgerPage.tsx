import type { ReactNode } from 'react';

interface LedgerPageProps {
  children: ReactNode;
}

export function LedgerPage({ children }: LedgerPageProps) {
  return (
    <article className="bg-[var(--paper)] rounded-lg shadow-[var(--shadow-page)] p-8 lg:p-10 paper-grain">
      <div className="relative z-10">
        {children}
      </div>
    </article>
  );
}
