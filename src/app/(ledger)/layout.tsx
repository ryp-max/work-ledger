import { LedgerShell } from '@/components/LedgerShell';
import { SidebarIndex } from '@/components/SidebarIndex';
import { getAllYears, getWeeksByYear, getAllTags, getLatestWeek } from '@/lib/content';

export default function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const years = getAllYears();
  const latestWeek = getLatestWeek();
  const selectedYear = latestWeek?.year || new Date().getFullYear();
  const weeks = getWeeksByYear(selectedYear);
  const tags = getAllTags();
  
  // If no content exists yet, show placeholder years
  const displayYears = years.length > 0 ? years : [new Date().getFullYear()];
  
  return (
    <LedgerShell
      sidebar={
        <SidebarIndex
          years={displayYears}
          selectedYear={selectedYear}
          weeks={weeks}
          tags={tags}
        />
      }
    >
      {children}
    </LedgerShell>
  );
}
