import { LedgerPage } from '@/components/LedgerPage';

export default function AboutPage() {
  return (
    <LedgerPage>
      <header className="mb-8 pb-6 border-b border-[var(--tape-border)]">
        <h1 className="font-serif text-4xl font-semibold text-[var(--ink)] mb-2">
          About
        </h1>
        <p className="text-[var(--ink-light)]">
          The story behind this ledger
        </p>
      </header>
      
      <div className="prose">
        <p>
          <strong>Work Ledger</strong> is a personal journal for tracking creative and technical work, 
          week by week. It&apos;s designed with a calm, focused aesthetic inspired by Japanese 
          handcrafted notebooks and woodworking traditions.
        </p>
        
        <h2>Philosophy</h2>
        <p>
          In a world of endless notifications and scattered tools, this ledger provides a 
          quiet space for reflection. Each week becomes a page in an ongoing story of work 
          and craft.
        </p>
        
        <h2>How It Works</h2>
        <ul>
          <li>Each week is a single MDX file with structured frontmatter</li>
          <li>Content is organized into sections: Shipped, In Progress, Links, Artifacts, and Grain (reflections)</li>
          <li>Tags connect weeks to ongoing projects</li>
          <li>The guestbook allows visitors to leave their mark</li>
        </ul>
        
        <h2>Built With</h2>
        <ul>
          <li>Next.js 14+ with App Router</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>MDX for content</li>
          <li>Framer Motion for subtle animations</li>
        </ul>
        
        <p className="text-[var(--ink-muted)] text-sm mt-8">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--tape)] rounded text-xs">⌘K</kbd> anywhere to search.
        </p>
      </div>
    </LedgerPage>
  );
}
