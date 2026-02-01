import { Workbench } from '@/components/workbench';

export default function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The workbench is now the full experience - no children needed
  return <Workbench />;
}
