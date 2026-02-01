import { notFound } from 'next/navigation';
import { getWeek, getAllWeeks } from '@/lib/content';
import { serializeMDX } from '@/lib/mdx';
import { LedgerPage } from '@/components/LedgerPage';
import { LedgerHeader } from '@/components/LedgerHeader';
import { SectionBlock } from '@/components/SectionBlock';
import { LinkTape } from '@/components/LinkTape';
import { ArtifactGrid } from '@/components/ArtifactGrid';
import { MDXContent } from '@/components/MDXContent';
import { BenchRadio } from '@/components/BenchRadio';

interface PageProps {
  params: Promise<{
    year: string;
    week: string;
  }>;
}

export async function generateStaticParams() {
  const weeks = getAllWeeks();
  return weeks.map(w => ({
    year: w.year.toString(),
    week: w.week.toString().padStart(2, '0'),
  }));
}

export default async function WeekPage({ params }: PageProps) {
  const { year, week } = await params;
  const yearNum = parseInt(year);
  const weekNum = parseInt(week);
  
  if (isNaN(yearNum) || isNaN(weekNum)) {
    notFound();
  }
  
  const weekData = getWeek(yearNum, weekNum);
  
  if (!weekData) {
    notFound();
  }
  
  const mdxSource = await serializeMDX(weekData.content);
  const { frontmatter } = weekData;
  
  return (
    <>
      <LedgerPage>
        <LedgerHeader
          title={frontmatter.title}
          dateStart={frontmatter.date_start}
          dateEnd={frontmatter.date_end}
          status={frontmatter.status}
        />
        
        {/* MDX Content (Shipped, In Progress, Grain, Notes) */}
        <MDXContent source={mdxSource} />
        
        {/* Links */}
        {frontmatter.links.length > 0 && (
          <SectionBlock title="Links">
            <LinkTape links={frontmatter.links} />
          </SectionBlock>
        )}
        
        {/* Artifacts */}
        {frontmatter.artifacts.length > 0 && (
          <SectionBlock title="Artifacts">
            <ArtifactGrid artifacts={frontmatter.artifacts} />
          </SectionBlock>
        )}
      </LedgerPage>
      
      {/* Music player */}
      {frontmatter.music && (
        <BenchRadio track={frontmatter.music.track} src={frontmatter.music.src} />
      )}
    </>
  );
}
