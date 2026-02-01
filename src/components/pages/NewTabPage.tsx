'use client';

import { useState, useEffect, useRef } from 'react';
import { BOOKMARKS } from '../ChromeBrowser';

interface NewTabPageProps {
  onBookmarkClick: (bookmark: typeof BOOKMARKS[0]) => void;
  onOmniboxSubmit?: (value: string) => void;
  omniboxRef?: React.RefObject<HTMLInputElement>;
}

const MICRO_NOTES = [
  "This week: Building a personal workspace that feels like home",
  "This week: Exploring new ways to document the creative process",
  "This week: Finding calm in the details",
];

const SHORTCUTS = [
  { id: 'weekly-log', title: 'Weekly Log', icon: '📝', color: 'from-blue-500 to-blue-600' },
  { id: 'chatgpt', title: 'ChatGPT', icon: '🤖', color: 'from-green-500 to-green-600' },
  { id: 'spotify', title: 'Spotify', icon: '🎵', color: 'from-green-400 to-green-500' },
  { id: 'photos', title: 'Photos', icon: '📷', color: 'from-purple-500 to-purple-600' },
  { id: 'guestbook', title: 'Guestbook', icon: '✍️', color: 'from-orange-500 to-orange-600' },
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
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[600px] px-8 py-16">
      {/* Maker's Mark Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-sm">
          <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      {/* Centered Omnibox */}
      <div className="w-full max-w-2xl mb-8">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-gray-300 dark:focus-within:border-gray-500 transition-all duration-200 px-6 py-4">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search or ask…"
              className="flex-1 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base bg-transparent"
              autoFocus
            />
            <div className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block">⌘L</div>
          </div>
        </form>
      </div>

      {/* Rotating Micro-Note */}
      <div className="w-full max-w-2xl mb-12 h-6 flex items-center justify-center">
        <p className={`text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${showNote ? 'opacity-100' : 'opacity-0'}`}>
          {MICRO_NOTES[currentNoteIndex]}
        </p>
      </div>

      {/* Shortcuts */}
      <div className="w-full max-w-3xl grid grid-cols-5 gap-6">
        {SHORTCUTS.map((shortcut) => (
          <button
            key={shortcut.id}
            onClick={() => handleShortcutClick(shortcut)}
            className="group flex flex-col items-center gap-3"
          >
            <div className={`
              w-14 h-14 rounded-2xl bg-gradient-to-br ${shortcut.color} 
              flex items-center justify-center text-white text-2xl
              shadow-sm group-hover:shadow-md group-hover:scale-105
              transition-all duration-200
            `}>
              {shortcut.icon}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200">
              {shortcut.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
