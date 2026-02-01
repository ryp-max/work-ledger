import type { ReactNode } from 'react';

interface SectionBlockProps {
  title: string;
  children: ReactNode;
}

export function SectionBlock({ title, children }: SectionBlockProps) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-xl font-semibold text-[var(--ink)] mb-4 pb-2 border-b border-[var(--tape-border)]">
        {title}
      </h2>
      <div className="text-[var(--ink)]">
        {children}
      </div>
    </section>
  );
}
