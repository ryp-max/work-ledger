import Link from 'next/link';
import { getLatestWeek, getAllWeeks } from '@/lib/content';

export default function HomePage() {
  const latestWeek = getLatestWeek();
  const allWeeks = getAllWeeks();
  
  return (
    <div className="bg-[var(--paper)] rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      {/* Ledger notebook styling */}
      <div className="border-l-4 border-red-800 pl-4">
        <h1 className="font-serif text-3xl font-bold text-[var(--ink)] mb-2">
          Work Ledger
        </h1>
        <p className="text-[var(--ink-light)] text-sm mb-6">
          A craftsman&apos;s journal of weekly work
        </p>
      </div>

      {/* Quick navigation */}
      <div className="mt-6 space-y-3">
        <h2 className="font-serif text-lg font-semibold text-[var(--ink)] border-b border-[var(--tape-border)] pb-2">
          Recent Weeks
        </h2>
        
        {allWeeks.length === 0 ? (
          <p className="text-[var(--ink-muted)] text-sm py-4">
            No entries yet. Add your first week in <code className="bg-[var(--tape)] px-1 rounded">content/weeks/</code>
          </p>
        ) : (
          <ul className="space-y-2">
            {allWeeks.slice(0, 5).map(week => (
              <li key={week.slug}>
                <Link 
                  href={week.slug}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--tape)] 
                             hover:bg-[var(--tape-border)] transition-colors group"
                >
                  <div>
                    <span className="font-medium text-[var(--ink)]">{week.title}</span>
                    <span className="ml-2 text-xs text-[var(--ink-muted)]">
                      {week.dateStart} – {week.dateEnd}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    week.status === 'in-progress' 
                      ? 'bg-amber-100 text-amber-800' 
                      : week.status === 'reviewed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {week.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-6 pt-4 border-t border-[var(--tape-border)] flex gap-4 text-sm">
        <Link href="/guestbook" className="text-[var(--stamp)] hover:underline">
          ✎ Guestbook
        </Link>
        <Link href="/projects" className="text-[var(--stamp)] hover:underline">
          ◈ Projects
        </Link>
        <Link href="/about" className="text-[var(--stamp)] hover:underline">
          ○ About
        </Link>
      </div>
    </div>
  );
}
