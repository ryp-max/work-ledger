'use client';

import { BOOKMARKS } from '../ChromeBrowser';

interface NewTabPageProps {
  onBookmarkClick: (bookmark: typeof BOOKMARKS[0]) => void;
}

const DESIGN_BOOKMARKS = [
  { id: 'news', title: 'News', icon: '📰', color: 'bg-blue-500' },
  { id: 'youtube', title: 'Youtube', icon: '▶️', color: 'bg-red-500' },
  { id: 'maps', title: 'Maps', icon: '📍', color: 'bg-green-500' },
  { id: 'gmail', title: 'Gmail', icon: '✉️', color: 'bg-red-600' },
  { id: 'drive', title: 'Drive', icon: '📁', color: 'bg-blue-600' },
];

export function NewTabPage({ onBookmarkClick }: NewTabPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[600px] bg-white">
      {/* Search Bar - Centered */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center gap-4 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow px-6 py-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Ask me anything"
            className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-base"
            autoFocus
          />
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Quick Access Icons */}
      <div className="w-full max-w-4xl grid grid-cols-5 gap-6 px-4">
        {DESIGN_BOOKMARKS.map((bookmark) => (
          <button
            key={bookmark.id}
            onClick={() => {
              // Map to actual bookmarks or create new tab
              const existingBookmark = BOOKMARKS.find(b => b.title.toLowerCase() === bookmark.title.toLowerCase());
              if (existingBookmark) {
                onBookmarkClick(existingBookmark);
              }
            }}
            className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`w-14 h-14 rounded-full ${bookmark.color} flex items-center justify-center text-white text-2xl shadow-sm group-hover:shadow-md transition-shadow`}>
              {bookmark.icon}
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{bookmark.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
