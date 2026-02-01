import Link from 'next/link';
import { LedgerPage } from '@/components/LedgerPage';

export default function NotFound() {
  return (
    <LedgerPage>
      <div className="text-center py-16">
        <div className="inline-block px-4 py-2 border-2 border-[var(--stamp)] text-[var(--stamp)] 
                        font-serif text-sm uppercase tracking-wider rounded rotate-[-2deg] mb-8">
          Page Not Found
        </div>
        
        <h1 className="font-serif text-3xl font-semibold text-[var(--ink)] mb-4">
          404
        </h1>
        
        <p className="text-[var(--ink-light)] mb-8">
          This page of the ledger seems to be missing.
        </p>
        
        <Link 
          href="/"
          className="inline-block px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded hover:bg-[var(--ink-light)] transition-colors"
        >
          Return to Ledger
        </Link>
      </div>
    </LedgerPage>
  );
}
