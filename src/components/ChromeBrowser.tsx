'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { NewTabPage } from './pages/NewTabPage';
import { WeeklyLogPage } from './pages/WeeklyLogPage';
import { PhotosPage } from './pages/PhotosPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { ChatGPTPage } from './pages/ChatGPTPage';

export type PageType = 'newtab' | 'weekly-log' | 'photos' | 'guestbook' | 'chatgpt' | 'url';

export interface Tab {
  id: string;
  title: string;
  pageType: PageType;
  url: string;
  favicon?: string;
}

const DEFAULT_TABS: Tab[] = [
  { id: '1', title: 'New Tab', pageType: 'newtab', url: 'chrome://newtab' },
  { id: '2', title: 'Weekly Log', pageType: 'weekly-log', url: 'chrome://weekly-log' },
  { id: '3', title: 'Photos', pageType: 'photos', url: 'chrome://photos' },
  { id: '4', title: 'Guestbook', pageType: 'guestbook', url: 'chrome://guestbook' },
  { id: '5', title: 'ChatGPT', pageType: 'chatgpt', url: 'chrome://chatgpt' },
];

export const BOOKMARKS = [
  { id: 'weekly-log', title: 'Weekly Log', url: 'chrome://weekly-log', icon: '📝' },
  { id: 'chatgpt', title: 'ChatGPT', url: 'chrome://chatgpt', icon: '🤖' },
  { id: 'spotify', title: 'Spotify', url: 'https://open.spotify.com', icon: '🎵' },
  { id: 'photos', title: 'Photos', url: 'chrome://photos', icon: '📷' },
  { id: 'guestbook', title: 'Guestbook', url: 'chrome://guestbook', icon: '✍️' },
];

export function ChromeBrowser() {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [omniboxValue, setOmniboxValue] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const omniboxRef = useRef<HTMLInputElement>(null);

  // Apply dark mode class on mount and when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Keyboard shortcuts: ⌘L focuses omnibox, ⌘1-5 switches tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        omniboxRef.current?.focus();
        omniboxRef.current?.select();
      }
      // Tab switching with ⌘1-5
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
          setActiveTabId(tabs[tabIndex].id);
          const tab = tabs[tabIndex];
          setOmniboxValue(tab.url);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs]);

  const addTab = useCallback((pageType: PageType = 'newtab', url?: string, title?: string) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: title || 'New Tab',
      pageType,
      url: url || `chrome://${pageType}`,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setOmniboxValue(newTab.url);
  }, []);

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      return filtered;
    });
    
    if (tabId === activeTabId) {
      setTabs(prev => {
        const filtered = prev.filter(t => t.id !== tabId);
        if (filtered.length > 0) {
          const newActiveId = filtered[filtered.length - 1].id;
          setActiveTabId(newActiveId);
          const newActiveTab = filtered.find(t => t.id === newActiveId);
          if (newActiveTab) {
            setOmniboxValue(newActiveTab.url);
          }
        }
        return filtered;
      });
    }
  }, [activeTabId, tabs.length]);

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setOmniboxValue(tab.url);
    }
  }, [tabs]);

  const handleOmniboxSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const input = omniboxValue.trim().toLowerCase();
    
    if (input.includes('chat') || input.includes('gpt') || input === '') {
      addTab('chatgpt', 'chrome://chatgpt', 'ChatGPT');
      return;
    }
    
    if (input.startsWith('http://') || input.startsWith('https://') || 
        (input.includes('.') && !input.includes(' '))) {
      const url = input.startsWith('http') ? input : `https://${input}`;
      addTab('url', url, new URL(url).hostname);
      return;
    }
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(omniboxValue)}`;
    addTab('url', searchUrl, 'Google Search');
  }, [omniboxValue, addTab]);

  const handleBookmarkClick = useCallback((bookmark: typeof BOOKMARKS[0]) => {
    if (bookmark.url.startsWith('chrome://')) {
      const pageType = bookmark.url.replace('chrome://', '') as PageType;
      addTab(pageType, bookmark.url, bookmark.title);
    } else {
      addTab('url', bookmark.url, bookmark.title);
    }
  }, [addTab]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const renderContent = () => {
    switch (activeTab.pageType) {
      case 'newtab':
        return <NewTabPage onBookmarkClick={handleBookmarkClick} />;
      case 'weekly-log':
        return <WeeklyLogPage />;
      case 'photos':
        return <PhotosPage />;
      case 'guestbook':
        return <GuestbookPage />;
      case 'chatgpt':
        return <ChatGPTPage />;
      case 'url':
        return (
          <iframe
            src={activeTab.url}
            className="w-full h-full border-0"
            title={activeTab.title}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        );
      default:
        return <div className="p-8">Unknown page type</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8 transition-colors duration-300">
      {/* Dark Mode Toggle - Top Right */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-50 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-200"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Browser Window */}
      <div className="w-full max-w-6xl h-full max-h-[85vh] bg-white dark:bg-gray-800 rounded-[20px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
        {/* Tabs Bar - Pill-shaped */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`
                group relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeTabId === tab.id 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="relative z-10">{tab.title}</span>
              {activeTabId === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
              )}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="ml-2 opacity-0 group-hover:opacity-100 w-4 h-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-opacity"
                >
                  ×
                </button>
              )}
            </button>
          ))}
          <button
            onClick={() => addTab('newtab')}
            className="ml-auto w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
            title="New Tab"
          >
            +
          </button>
        </div>

        {/* Bookmarks Bar - Tag/Chip Style */}
        <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
          {BOOKMARKS.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => handleBookmarkClick(bookmark)}
              className="px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
            >
              {bookmark.icon} {bookmark.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
