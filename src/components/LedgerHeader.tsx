import type { WeekStatus } from '@/lib/schemas';

interface LedgerHeaderProps {
  title: string;
  dateStart: string;
  dateEnd: string;
  status: WeekStatus;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

const statusLabels: Record<WeekStatus, string> = {
  'reviewed': 'Reviewed',
  'in-progress': 'In Progress',
  'archived': 'Archived',
};

export function LedgerHeader({ title, dateStart, dateEnd, status }: LedgerHeaderProps) {
  return (
    <header className="mb-8 pb-6 border-b border-[var(--tape-border)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[var(--ink)] mb-2">
            {title}
          </h1>
          <p className="text-[var(--ink-light)] font-sans">
            {formatDateRange(dateStart, dateEnd)}
          </p>
        </div>
        
        {/* Status stamp */}
        <div 
          className="px-3 py-1.5 border-2 border-[var(--stamp)] text-[var(--stamp)] 
                     font-serif text-xs uppercase tracking-wider rounded
                     rotate-[-3deg] opacity-70"
          style={{
            boxShadow: 'inset 0 0 0 1px var(--stamp)',
          }}
        >
          {statusLabels[status]}
        </div>
      </div>
    </header>
  );
}
