import type { Link as LinkType, LinkKind } from '@/lib/schemas';

interface LinkTapeProps {
  links: LinkType[];
}

const kindIcons: Record<LinkKind, string> = {
  figma: '◈',
  doc: '▤',
  slack: '◉',
  prototype: '▷',
  misc: '◇',
};

const kindColors: Record<LinkKind, string> = {
  figma: 'bg-purple-100 border-purple-200 text-purple-800',
  doc: 'bg-blue-50 border-blue-200 text-blue-800',
  slack: 'bg-green-50 border-green-200 text-green-800',
  prototype: 'bg-orange-50 border-orange-200 text-orange-800',
  misc: 'bg-[var(--tape)] border-[var(--tape-border)] text-[var(--ink)]',
};

export function LinkTape({ links }: LinkTapeProps) {
  if (links.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5
            text-sm font-medium rounded border
            transition-all duration-150
            hover:shadow-sm hover:-translate-y-0.5
            ${kindColors[link.kind]}
          `}
          style={{
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span className="text-xs opacity-70">{kindIcons[link.kind]}</span>
          <span className="truncate max-w-48">{link.label}</span>
          <span className="text-xs opacity-50">↗</span>
        </a>
      ))}
    </div>
  );
}
