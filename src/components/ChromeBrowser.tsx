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
  const omniboxRef = useRef<HTMLInputElement>(null);

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
    <div className="w-full h-screen bg-[#f8f9fa] flex items-center justify-center p-2">
      {/* Browser Window with Drop Shadow */}
      <div className="w-full h-full max-w-[1920px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Window Chrome */}
        <div className="h-[34px] bg-[#f1f3f4] flex items-center justify-between px-2 border-b border-[#dadce0] rounded-t-lg">
          {/* Traffic Lights (macOS style) */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
          </div>
          <div className="flex-1"></div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-[#f1f3f4] flex items-end overflow-x-auto border-b border-[#dadce0] h-[36px]">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 h-[36px] min-w-[180px] max-w-[240px] cursor-pointer
                border-t border-l border-r border-[#dadce0] rounded-t-lg transition-colors
                ${activeTabId === tab.id 
                  ? 'bg-white border-b-white -mb-px z-10' 
                  : 'bg-[#e8eaed] hover:bg-[#dadce0] border-b border-[#dadce0]'
                }
              `}
            >
              {tab.favicon && (
                <span className="text-xs">{tab.favicon}</span>
              )}
              <span className={`flex-1 text-[13px] truncate font-normal ${activeTabId === tab.id ? 'text-[#202124]' : 'text-[#5f6368]'}`}>
                {tab.title}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="w-4 h-4 rounded-full hover:bg-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-[#202124] transition-colors text-[16px] leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {/* New Tab Button */}
          <button
            onClick={() => addTab('newtab')}
            className="w-8 h-8 mx-1 rounded-full hover:bg-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-[#202124] transition-colors text-xl"
            title="New Tab"
          >
            +
          </button>
        </div>

        {/* Omnibox */}
        <div className="bg-white border-b border-[#dadce0] px-2 py-1 flex items-center gap-1 h-[48px]">
          <button className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] hover:text-[#202124] transition-colors" title="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] hover:text-[#202124] transition-colors" title="Forward">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] hover:text-[#202124] transition-colors" title="Reload">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <form onSubmit={handleOmniboxSubmit} className="flex-1 flex items-center mx-2">
            <div className="flex-1 flex items-center gap-3 bg-[#f1f3f4] rounded-full px-4 h-[36px] border border-transparent hover:bg-white hover:shadow-sm focus-within:bg-white focus-within:shadow-md transition-all">
              <svg className="w-5 h-5 text-[#9aa0a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={omniboxRef}
                type="text"
                value={omniboxValue}
                onChange={(e) => setOmniboxValue(e.target.value)}
                placeholder="Search Google or type a URL"
                className="flex-1 bg-transparent text-[14px] text-[#202124] outline-none placeholder-[#9aa0a6]"
              />
            </div>
          </form>
        </div>

        {/* Bookmarks Bar */}
        <div className="bg-white border-b border-[#dadce0] px-2 py-1 flex items-center gap-1 h-[32px]">
          {BOOKMARKS.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => handleBookmarkClick(bookmark)}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f1f3f4] transition-colors group"
            >
              <div className={`w-5 h-5 rounded-full ${bookmark.color} flex items-center justify-center text-white text-xs shadow-sm`}>
                {bookmark.icon}
              </div>
              <span className="text-[13px] text-[#5f6368] group-hover:text-[#202124]">{bookmark.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white overflow-auto rounded-b-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
