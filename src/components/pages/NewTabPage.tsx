'use client';

import { useState, useEffect, useRef } from 'react';
import { BOOKMARKS } from '../ChromeBrowser';

interface NewTabPageProps {
  onBookmarkClick: (bookmark: typeof BOOKMARKS[0]) => void;
  onOmniboxSubmit?: (value: string) => void;
  omniboxRef?: React.RefObject<HTMLInputElement | null>;
}

const MICRO_NOTES = [
  "This week: Building a personal workspace that feels like home",
  "This week: Exploring new ways to document the creative process",
  "This week: Finding calm in the details",
];

const SHORTCUTS = [
  { 
    id: 'weekly-log', 
    title: 'Weekly Log', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    id: 'games', 
    title: 'Games', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.751 9.75l-3.72-3.72a3 3 0 00-4.242 0l-3.72 3.72m0 4.5l3.72 3.72a3 3 0 004.242 0l3.72-3.72m-4.5-4.5l4.5-4.5m0 4.5l-4.5 4.5m-4.5-4.5l4.5 4.5" />
      </svg>
    )
  },
  { 
    id: 'spotify', 
    title: 'Spotify', 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.36.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  { 
    id: 'photos', 
    title: 'Photos', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'guestbook', 
    title: 'Guestbook', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.05 11.05a2.5 2.5 0 113.536 3.536M9 9l-3 3m0 0l3 3m-3-3h12M3 20h18a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
];

export function NewTabPage({ onBookmarkClick, onOmniboxSubmit, omniboxRef: externalRef }: NewTabPageProps) {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [showNote, setShowNote] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const internalRef = useRef<HTMLInputElement>(null);
  const searchRef = externalRef || internalRef;

  // Rotate micro-notes every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowNote(false);
      setTimeout(() => {
        setCurrentNoteIndex((prev) => (prev + 1) % MICRO_NOTES.length);
        setShowNote(true);
      }, 300);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleShortcutClick = (shortcut: typeof SHORTCUTS[0]) => {
    const bookmark = BOOKMARKS.find(b => b.id === shortcut.id);
    if (bookmark) {
      onBookmarkClick(bookmark);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOmniboxSubmit && searchValue.trim()) {
      onOmniboxSubmit(searchValue);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8" style={{ marginTop: '-40px' }}>
      {/* Centered Omnibox */}
      <div className="w-full mb-3" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <div 
            className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:ring-gray-500 transition-all duration-200 px-5 py-3"
          >
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Ask me anything"
              className="flex-1 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base bg-transparent"
              autoFocus
            />
          </div>
        </form>
      </div>

      {/* Rotating Micro-Note */}
      <div className="w-full mb-6 h-4 flex items-center justify-center" style={{ maxWidth: '640px' }}>
        <p className={`text-[11px] text-gray-400 dark:text-gray-500 transition-opacity duration-300 ${showNote ? 'opacity-100' : 'opacity-0'}`}>
          {MICRO_NOTES[currentNoteIndex]}
        </p>
      </div>

      {/* Shortcuts - Chrome-style Squircle Tiles */}
      <div className="w-full grid grid-cols-5 gap-3" style={{ maxWidth: '640px' }}>
        {SHORTCUTS.map((shortcut) => (
          <button
            key={shortcut.id}
            onClick={() => handleShortcutClick(shortcut)}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-11 h-11 rounded-[14px] bg-white dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:shadow-md transition-all duration-200">
              {shortcut.icon}
            </div>
            <span className="text-[12px] text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 leading-tight">
              {shortcut.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
