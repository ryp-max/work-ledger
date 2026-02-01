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
  { id: 'spotify', title: 'Spotify', url: 'https://open.spotify.com', icon: '🎵', color: 'bg-green-500' },
  { id: 'blog', title: 'Blog', url: 'chrome://weekly-log', icon: '📝', color: 'bg-blue-500' },
  { id: 'chatgpt', title: 'ChatGPT', url: 'chrome://chatgpt', icon: '🤖', color: 'bg-green-600' },
  { id: 'figma', title: 'Figma', url: 'https://figma.com', icon: '🎨', color: 'bg-purple-500' },
  { id: 'docs', title: 'Docs', url: 'https://docs.google.com', icon: '📄', color: 'bg-blue-600' },
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

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut: Cmd/Ctrl+L focuses omnibox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        omniboxRef.current?.focus();
        omniboxRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    if (tabs.length <= 1) return; // Don't close last tab
    
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      return filtered;
    });
    
    // If closing active tab, switch to another
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
    
    // Handle chat keywords
    if (input.includes('chat') || input.includes('gpt') || input === '') {
      addTab('chatgpt', 'chrome://chatgpt', 'ChatGPT');
      return;
    }
    
    // Handle URLs
    if (input.startsWith('http://') || input.startsWith('https://') || 
        (input.includes('.') && !input.includes(' '))) {
      const url = input.startsWith('http') ? input : `https://${input}`;
      addTab('url', url, new URL(url).hostname);
      return;
    }
    
    // Handle search query - open Google search
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
    <div className="w-full h-screen bg-gray-200 dark:bg-black flex items-center justify-center p-8">
      {/* Dark Mode Toggle Switch - Outside Browser, Top Right */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 relative w-11 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        role="switch"
        aria-checked={darkMode}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
            darkMode ? 'translate-x-5' : 'translate-x-0'
          }`}
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
        </span>
      </button>

      {/* Browser Window with Drop Shadow */}
      <div className="w-full max-w-[92rem] h-full max-h-[90vh] bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
        {/* Window Chrome */}
        <div className="h-8 bg-gray-100 dark:bg-[#2d2d2d] flex items-center justify-between px-3 border-b border-gray-200 dark:border-[#3d3d3d] rounded-t-[24px]">
          {/* Traffic Lights (macOS style) */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
          </div>
          <div className="flex-1"></div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-gray-100 dark:bg-[#2d2d2d] flex items-end overflow-x-auto border-b border-gray-200 dark:border-[#3d3d3d]">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 min-w-[180px] max-w-[240px] cursor-pointer
                border-t border-l border-r border-gray-300 dark:border-[#3d3d3d] rounded-t-lg transition-colors
                ${activeTabId === tab.id 
                  ? 'bg-white dark:bg-[#1e1e1e] border-b-white dark:border-b-[#1e1e1e] -mb-px' 
                  : 'bg-gray-200 dark:bg-[#252525] hover:bg-gray-250 dark:hover:bg-[#2a2a2a] border-b border-gray-300 dark:border-[#3d3d3d]'
                }
              `}
            >
              {tab.favicon && (
                <span className="text-xs">{tab.favicon}</span>
              )}
              <span className={`flex-1 text-sm truncate ${activeTabId === tab.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                {tab.title}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="w-4 h-4 rounded hover:bg-gray-300 dark:hover:bg-[#3d3d3d] flex items-center justify-center text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {/* New Tab Button */}
          <button
            onClick={() => addTab('newtab')}
            className="w-8 h-8 mx-1 rounded hover:bg-gray-300 dark:hover:bg-[#3d3d3d] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="New Tab"
          >
            +
          </button>
        </div>

        {/* Omnibox */}
        <div className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-[#3d3d3d] px-4 py-2 flex items-center gap-2">
          <button className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" title="Back">
            ←
          </button>
          <button className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" title="Forward">
            →
          </button>
          <button className="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" title="Reload">
            ↻
          </button>
          <form onSubmit={handleOmniboxSubmit} className="flex-1 flex items-center">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-[#2d2d2d] rounded-lg px-4 py-2 border border-gray-200 dark:border-[#3d3d3d] hover:border-gray-300 dark:hover:border-[#4d4d4d] focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-[#2d2d2d] transition-colors">
              <span className="text-gray-400 dark:text-gray-500 text-sm">🔒</span>
              <input
                ref={omniboxRef}
                type="text"
                value={omniboxValue}
                onChange={(e) => setOmniboxValue(e.target.value)}
                placeholder="Search Google or type a URL"
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </form>
        </div>

        {/* Bookmarks Bar */}
        <div className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-[#3d3d3d] px-4 py-1.5 flex items-center gap-1">
          {BOOKMARKS.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => handleBookmarkClick(bookmark)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors group"
            >
              <div className={`w-5 h-5 rounded ${bookmark.color} flex items-center justify-center text-white text-xs`}>
                {bookmark.icon}
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">{bookmark.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#1e1e1e] overflow-auto rounded-b-[24px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
