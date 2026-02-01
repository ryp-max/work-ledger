import Link from 'next/link';
import { getAllTags, getWeeksByTag } from '@/lib/content';
import { LedgerPage } from '@/components/LedgerPage';
import { LedgerHeader } from '@/components/LedgerHeader';

export default function ProjectsPage() {
  const tags = getAllTags();
  
  return (
    <LedgerPage>
      <header className="mb-8 pb-6 border-b border-[var(--tape-border)]">
        <h1 className="font-serif text-4xl font-semibold text-[var(--ink)] mb-2">
          Projects
        </h1>
        <p className="text-[var(--ink-light)]">
          Work organized by project and theme
        </p>
      </header>
      
      {tags.length === 0 ? (
        <div className="text-center py-12 text-[var(--ink-muted)]">
          <p>No projects yet. Add tags to your week entries to see them here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tags.map(tag => {
            const weeks = getWeeksByTag(tag.name);
            return (
              <div key={tag.name} className="border-b border-[var(--tape-border)] pb-6 last:border-0">
                <h2 className="font-serif text-xl font-semibold text-[var(--ink)] mb-3">
                  {tag.name}
                  <span className="ml-2 text-sm font-normal text-[var(--ink-muted)]">
                    ({tag.count} {tag.count === 1 ? 'week' : 'weeks'})
                  </span>
                </h2>
                <ul className="space-y-1">
                  {weeks.slice(0, 5).map(week => (
                    <li key={week.slug}>
                      <Link 
                        href={week.slug}
                        className="text-[var(--stamp)] hover:text-[var(--stamp-light)] underline underline-offset-2"
                      >
                        {week.title}
                      </Link>
                      <span className="ml-2 text-xs text-[var(--ink-muted)]">
                        {week.dateStart}
                      </span>
                    </li>
                  ))}
                  {weeks.length > 5 && (
                    <li className="text-sm text-[var(--ink-muted)]">
                      +{weeks.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </LedgerPage>
  );
}
