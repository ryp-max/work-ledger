import { getAllWeeks, getWeek } from '@/lib/content';
import { LedgerPage } from '@/components/LedgerPage';
import { ArtifactGrid } from '@/components/ArtifactGrid';
import type { Artifact } from '@/lib/schemas';

export default function PhotosPage() {
  const weeks = getAllWeeks();
  
  // Collect all artifacts from all weeks
  const allArtifacts: { artifact: Artifact; weekTitle: string; slug: string }[] = [];
  
  for (const weekMeta of weeks) {
    const week = getWeek(weekMeta.year, weekMeta.week);
    if (week?.frontmatter.artifacts) {
      for (const artifact of week.frontmatter.artifacts) {
        allArtifacts.push({
          artifact,
          weekTitle: week.title,
          slug: week.slug,
        });
      }
    }
  }
  
  return (
    <LedgerPage>
      <header className="mb-8 pb-6 border-b border-[var(--tape-border)]">
        <h1 className="font-serif text-4xl font-semibold text-[var(--ink)] mb-2">
          Photos
        </h1>
        <p className="text-[var(--ink-light)]">
          Artifacts and captures from the work
        </p>
      </header>
      
      {allArtifacts.length === 0 ? (
        <div className="text-center py-12 text-[var(--ink-muted)]">
          <p>No photos yet. Add artifacts to your week entries to see them here.</p>
        </div>
      ) : (
        <ArtifactGrid artifacts={allArtifacts.map(a => a.artifact)} />
      )}
    </LedgerPage>
  );
}
