'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

interface SearchItem {
  title: string;
  slug: string;
  dateRange: string;
  tags: string[];
  shipped?: string;
  inProgress?: string;
  grain?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const router = useRouter();
  
  // Load search index
  useEffect(() => {
    fetch('/search-index.json')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, []);
  
  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  const handleSelect = useCallback((slug: string) => {
    setOpen(false);
    setSearch('');
    router.push(slug);
  }, [router]);
  
  // Filter items based on search
  const filteredItems = items.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.tags.some(t => t.toLowerCase().includes(searchLower)) ||
      item.shipped?.toLowerCase().includes(searchLower) ||
      item.inProgress?.toLowerCase().includes(searchLower) ||
      item.grain?.toLowerCase().includes(searchLower)
    );
  });
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      
      {/* Command dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <Command 
          className="bg-[var(--paper)] rounded-xl shadow-2xl border border-[var(--tape-border)] overflow-hidden"
          shouldFilter={false}
        >
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search weeks, tags, or content..."
            className="w-full px-4 py-4 text-base border-b border-[var(--tape-border)] 
                       bg-transparent outline-none placeholder:text-[var(--ink-muted)]"
          />
          
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-[var(--ink-muted)] text-sm">
              No results found.
            </Command.Empty>
            
            {/* Quick links */}
            <Command.Group heading="Quick Links" className="mb-2">
              <Command.Item
                onSelect={() => handleSelect('/photos')}
                className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--tape)] flex items-center gap-2"
              >
                <span className="text-[var(--ink-muted)]">◻</span>
                Photos
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/guestbook')}
                className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--tape)] flex items-center gap-2"
              >
                <span className="text-[var(--ink-muted)]">✎</span>
                Guestbook
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/projects')}
                className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--tape)] flex items-center gap-2"
              >
                <span className="text-[var(--ink-muted)]">◈</span>
                Projects
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/about')}
                className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--tape)] flex items-center gap-2"
              >
                <span className="text-[var(--ink-muted)]">○</span>
                About
              </Command.Item>
            </Command.Group>
            
            {/* Weeks */}
            {filteredItems.length > 0 && (
              <Command.Group heading="Weeks" className="mt-2">
                {filteredItems.slice(0, 10).map(item => (
                  <Command.Item
                    key={item.slug}
                    onSelect={() => handleSelect(item.slug)}
                    className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--tape)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-[var(--ink-muted)]">{item.dateRange}</span>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {item.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-[var(--tape)] rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-[var(--tape-border)] flex items-center justify-between text-xs text-[var(--ink-muted)]">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
