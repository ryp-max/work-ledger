'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { WeekMeta } from '@/lib/schemas';

interface SidebarIndexProps {
  years: number[];
  selectedYear: number;
  weeks: WeekMeta[];
  tags: { name: string; count: number }[];
}

export function SidebarIndex({ years, selectedYear, weeks, tags }: SidebarIndexProps) {
  const pathname = usePathname();
  
  // Get current week from pathname
  const pathParts = pathname.split('/');
  const currentWeek = pathParts[3] ? parseInt(pathParts[3]) : null;
  
  return (
    <nav className="p-5 font-sans text-sm">
      {/* Year selector */}
      <div className="mb-6">
        <h3 className="font-serif text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2">
          Year
        </h3>
        <div className="flex gap-2 flex-wrap">
          {years.map(year => (
            <Link
              key={year}
              href={`/weeks/${year}/01`}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                year === selectedYear
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'bg-[var(--tape)] text-[var(--ink)] hover:bg-[var(--tape-border)]'
              }`}
            >
              {year}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Weeks list */}
      <div className="mb-6">
        <h3 className="font-serif text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2">
          Weeks
        </h3>
        <ul className="space-y-0.5 max-h-64 overflow-y-auto">
          {weeks.map(week => {
            const isActive = week.year === selectedYear && week.week === currentWeek;
            return (
              <li key={`${week.year}-${week.week}`}>
                <Link
                  href={week.slug}
                  className={`block px-3 py-1.5 rounded transition-colors ${
                    isActive
                      ? 'bg-[var(--stamp)] text-white'
                      : 'hover:bg-[var(--tape)]'
                  }`}
                >
                  <span className="font-medium">Week {week.week.toString().padStart(2, '0')}</span>
                  {week.status === 'in-progress' && (
                    <span className="ml-2 text-xs text-[var(--stamp)]">●</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Projects (tags) */}
      {tags.length > 0 && (
        <div className="mb-6">
          <h3 className="font-serif text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2">
            Projects
          </h3>
          <ul className="space-y-0.5">
            {tags.slice(0, 8).map(tag => (
              <li key={tag.name}>
                <Link
                  href={`/projects?tag=${encodeURIComponent(tag.name)}`}
                  className="block px-3 py-1.5 rounded hover:bg-[var(--tape)] transition-colors"
                >
                  <span>{tag.name}</span>
                  <span className="ml-2 text-xs text-[var(--ink-muted)]">({tag.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Ephemera */}
      <div className="pt-4 border-t border-[var(--tape-border)]">
        <h3 className="font-serif text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2">
          Ephemera
        </h3>
        <ul className="space-y-0.5">
          {[
            { href: '/photos', label: 'Photos', icon: '◻' },
            { href: '/guestbook', label: 'Guestbook', icon: '✎' },
            { href: '/about', label: 'About', icon: '○' },
          ].map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-1.5 rounded transition-colors ${
                  pathname === item.href
                    ? 'bg-[var(--tape)]'
                    : 'hover:bg-[var(--tape)]'
                }`}
              >
                <span className="mr-2 text-[var(--ink-muted)]">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="mt-8 pt-4 border-t border-[var(--tape-border)]">
        <p className="text-xs text-[var(--ink-muted)] text-center">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--tape)] rounded text-[10px]">⌘K</kbd> to search
        </p>
      </div>
    </nav>
  );
}
