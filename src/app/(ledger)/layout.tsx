import { Workbench } from '@/components/workbench';

export default function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Workbench>{children}</Workbench>;
}
