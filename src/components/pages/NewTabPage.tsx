'use client';

import { BOOKMARKS } from '../ChromeBrowser';

interface NewTabPageProps {
  onBookmarkClick: (bookmark: typeof BOOKMARKS[0]) => void;
}

const DESIGN_BOOKMARKS = [
  { id: 'news', title: 'News', icon: 'news' },
  { id: 'youtube', title: 'Youtube', icon: 'youtube' },
  { id: 'maps', title: 'Maps', icon: 'maps' },
  { id: 'gmail', title: 'Gmail', icon: 'gmail' },
  { id: 'drive', title: 'Drive', icon: 'drive' },
];

export function NewTabPage({ onBookmarkClick }: NewTabPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[600px] bg-gray-100 dark:bg-[#1e1e1e]">
      {/* Search Bar - Centered */}
      <div className="w-full max-w-2xl mb-16">
        <div className="flex items-center gap-3 bg-white dark:bg-white rounded-full border border-gray-300 dark:border-gray-300 shadow-sm px-4 py-3">
          {/* Magnifying glass icon - dark gray */}
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Ask me anything"
            className="flex-1 outline-none text-gray-700 dark:text-gray-700 placeholder-gray-500 dark:placeholder-gray-500 text-base bg-transparent"
            autoFocus
          />
          {/* Microphone icon - multi-colored */}
          <div className="w-5 h-5 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path fill="#34A853" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Access Icons */}
      <div className="w-full max-w-4xl grid grid-cols-5 gap-8 px-4">
        {DESIGN_BOOKMARKS.map((bookmark) => (
          <button
            key={bookmark.id}
            onClick={() => {
              const existingBookmark = BOOKMARKS.find(b => b.title.toLowerCase() === bookmark.title.toLowerCase());
              if (existingBookmark) {
                onBookmarkClick(existingBookmark);
              }
            }}
            className="flex flex-col items-center gap-2 group"
          >
            {/* News Icon */}
            {bookmark.icon === 'news' && (
              <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#2d2d2d] shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-blue-500 rounded"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">G</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Youtube Icon */}
            {bookmark.icon === 'youtube' && (
              <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#2d2d2d] shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                </div>
              </div>
            )}
            
            {/* Maps Icon */}
            {bookmark.icon === 'maps' && (
              <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#2d2d2d] shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-6 h-6 bg-red-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 bg-yellow-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-br-lg"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gmail Icon */}
            {bookmark.icon === 'gmail' && (
              <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#2d2d2d] shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-xl">M</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Drive Icon */}
            {bookmark.icon === 'drive' && (
              <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#2d2d2d] shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                <div className="relative w-12 h-12">
                  <div className="absolute top-0 left-0 w-6 h-6 bg-green-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 bg-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-br-lg"></div>
                </div>
              </div>
            )}
            
            <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 font-normal">{bookmark.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
