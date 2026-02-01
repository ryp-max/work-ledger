'use client';

import type { ReactNode } from 'react';

interface LedgerShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function LedgerShell({ sidebar, children }: LedgerShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left column: Sidebar */}
      <aside className="w-64 min-w-64 h-screen sticky top-0 bg-[var(--paper-dark)] border-r border-[var(--tape-border)] overflow-y-auto">
        {sidebar}
      </aside>
      
      {/* Right column: Ledger page */}
      <main className="flex-1 min-h-screen p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
