import { redirect } from 'next/navigation';
import { getLatestWeek } from '@/lib/content';
import { LedgerPage } from '@/components/LedgerPage';

export default function HomePage() {
  const latestWeek = getLatestWeek();
  
  if (latestWeek) {
    redirect(latestWeek.slug);
  }
  
  // No content yet - show welcome message
  return (
    <LedgerPage>
      <div className="text-center py-16">
        <h1 className="font-serif text-3xl font-semibold text-[var(--ink)] mb-4">
          Work Ledger
        </h1>
        <p className="text-[var(--ink-light)] mb-8">
          Your personal work journal awaits.
        </p>
        <div className="inline-block px-4 py-3 bg-[var(--tape)] rounded-lg text-sm text-[var(--ink-light)]">
          <p className="mb-2">Add your first week entry:</p>
          <code className="text-xs bg-[var(--paper-dark)] px-2 py-1 rounded">
            content/weeks/2026/week-01.mdx
          </code>
        </div>
      </div>
    </LedgerPage>
  );
}
