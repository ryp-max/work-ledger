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
  { id: 'weekly-log', title: 'Weekly Log', icon: '📝' },
  { id: 'chatgpt', title: 'ChatGPT', icon: '🤖' },
  { id: 'spotify', title: 'Spotify', icon: '🎵' },
  { id: 'photos', title: 'Photos', icon: '📷' },
  { id: 'guestbook', title: 'Guestbook', icon: '✍️' },
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
    <div className="w-full h-full flex flex-col items-center justify-center px-8">
      {/* Centered Omnibox */}
      <div className="w-full max-w-[640px] mb-5">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:ring-gray-500 transition-all duration-200 px-5 py-3">
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
      <div className="w-full max-w-[640px] mb-8 h-5 flex items-center justify-center">
        <p className={`text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${showNote ? 'opacity-100' : 'opacity-0'}`}>
          {MICRO_NOTES[currentNoteIndex]}
        </p>
      </div>

      {/* Shortcuts - Small Icons */}
      <div className="w-full max-w-[640px] grid grid-cols-5 gap-4">
        {SHORTCUTS.map((shortcut) => (
          <button
            key={shortcut.id}
            onClick={() => handleShortcutClick(shortcut)}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-all duration-200">
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
