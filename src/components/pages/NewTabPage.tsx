'use client';

import { BOOKMARKS } from '../ChromeBrowser';

interface NewTabPageProps {
  onBookmarkClick: (bookmark: typeof BOOKMARKS[0]) => void;
}

export function NewTabPage({ onBookmarkClick }: NewTabPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[600px]">
      {/* Google Logo Area */}
      <div className="mb-12">
        <div className="text-6xl font-normal text-gray-900 mb-2">
          <span className="text-blue-600">G</span>
          <span className="text-red-600">o</span>
          <span className="text-yellow-600">o</span>
          <span className="text-blue-600">g</span>
          <span className="text-green-600">l</span>
          <span className="text-red-600">e</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center gap-4 bg-white rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow px-6 py-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Google or type a URL"
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            autoFocus
          />
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="w-full max-w-4xl grid grid-cols-5 gap-4">
        {BOOKMARKS.map((bookmark) => (
          <button
            key={bookmark.id}
            onClick={() => onBookmarkClick(bookmark)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-full ${bookmark.color} flex items-center justify-center text-white text-xl shadow-sm group-hover:shadow-md transition-shadow`}>
              {bookmark.icon}
            </div>
            <span className="text-xs text-gray-700 group-hover:text-gray-900">{bookmark.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
