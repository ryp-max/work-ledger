'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { NewTabPage } from './pages/NewTabPage';
import { WeeklyLogPage } from './pages/WeeklyLogPage';
import { PhotosPage } from './pages/PhotosPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { ChatGPTPage } from './pages/ChatGPTPage';
import { SpotifyPage } from './pages/SpotifyPage';

export type PageType = 'newtab' | 'weekly-log' | 'photos' | 'guestbook' | 'chatgpt' | 'spotify' | 'url';

export interface Tab {
  id: string;
  title: string;
  pageType: PageType;
  url: string;
  favicon?: string;
}

const DEFAULT_TABS: Tab[] = [
  { id: '1', title: 'Home', pageType: 'newtab', url: 'chrome://newtab' },
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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const omniboxRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  
  // Playlist
  const PLAYLIST = [
    { id: 1, title: 'Overdrive', src: '/audio/overdrive.mp3' },
    { id: 2, title: 'Beautiful Escape (feat. Zak Abel)', src: '/audio/Beautiful Escape (feat. Zak Abel) Tom Misch.mp3' },
  ];

  // Audio state - persists across tab switches
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs]);

  const addTab = useCallback((pageType: PageType = 'newtab', url?: string, title?: string) => {
    // If trying to add Spotify tab, check if one already exists
    if (pageType === 'spotify') {
      const existingSpotifyTab = tabs.find(t => t.pageType === 'spotify');
      if (existingSpotifyTab) {
        setActiveTabId(existingSpotifyTab.id);
        return;
      }
    }
    
    const newTab: Tab = {
      id: Date.now().toString(),
      title: title || 'New Tab',
      pageType,
      url: url || `chrome://${pageType}`,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs]);

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Prevent closing the last tab
    if (tabs.length <= 1) return;
    
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      // If we closed the active tab, switch to the last remaining tab
      if (tabId === activeTabId && filtered.length > 0) {
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  }, [activeTabId, tabs.length]);

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const handleOmniboxSubmit = useCallback((value: string) => {
    const input = value.trim().toLowerCase();
    
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
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    addTab('url', searchUrl, 'Google Search');
  }, [addTab]);

  const handleBookmarkClick = useCallback((bookmark: typeof BOOKMARKS[0]) => {
    if (bookmark.url.startsWith('chrome://')) {
      const pageType = bookmark.url.replace('chrome://', '') as PageType;
      addTab(pageType, bookmark.url, bookmark.title);
    } else if (bookmark.id === 'spotify') {
      addTab('spotify', bookmark.url, bookmark.title);
    } else {
      addTab('url', bookmark.url, bookmark.title);
    }
  }, [addTab]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const isSpotifyTab = activeTab.pageType === 'spotify';

  // Audio control functions
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  }, [isPlaying]);

  const playSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
  }, []);

  const nextSong = useCallback(() => {
    if (isShuffled) {
      // Random song that's not the current one
      const availableIndices = PLAYLIST.map((_, i) => i).filter(i => i !== currentSongIndex);
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      playSong(randomIndex);
    } else {
      const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
      playSong(nextIndex);
    }
  }, [currentSongIndex, isShuffled, playSong]);

  const previousSong = useCallback(() => {
    if (isShuffled) {
      // Random song that's not the current one
      const availableIndices = PLAYLIST.map((_, i) => i).filter(i => i !== currentSongIndex);
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      playSong(randomIndex);
    } else {
      const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      playSong(prevIndex);
    }
  }, [currentSongIndex, isShuffled, playSong]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  // Switch to Spotify tab
  const goToSpotifyTab = useCallback(() => {
    const spotifyTab = tabs.find(t => t.pageType === 'spotify');
    if (spotifyTab) {
      switchTab(spotifyTab.id);
    } else {
      // If no Spotify tab exists, create one
      addTab('spotify', 'chrome://spotify', 'Spotify');
    }
  }, [tabs, switchTab, addTab]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[currentSongIndex].src);
      audioRef.current.loop = false; // Don't loop individual songs, handle playlist looping
      
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
    }
    
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle song ended event
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next song when current ends
      if (isShuffled) {
        const availableIndices = PLAYLIST.map((_, i) => i).filter(i => i !== currentSongIndex);
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        playSong(randomIndex);
      } else {
        const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
        playSong(nextIndex);
      }
    };
    
    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSongIndex, isShuffled, playSong]);

  // Update audio source when song changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    const wasPlaying = isPlaying;
    const currentSrc = audioRef.current.src.replace(window.location.origin, '');
    const newSrc = PLAYLIST[currentSongIndex].src;
    
    if (currentSrc !== newSrc) {
      audioRef.current.pause();
      audioRef.current.src = newSrc;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    }
  }, [currentSongIndex, isPlaying]);

  const renderContent = () => {
    switch (activeTab.pageType) {
      case 'newtab':
        return (
          <NewTabPage 
            onBookmarkClick={handleBookmarkClick}
            onOmniboxSubmit={handleOmniboxSubmit}
            omniboxRef={omniboxRef}
            onInteractiveHover={setIsHoveringInteractive}
          />
        );
      case 'weekly-log':
        return <WeeklyLogPage />;
      case 'photos':
        return <PhotosPage />;
      case 'guestbook':
        return <GuestbookPage />;
      case 'chatgpt':
        return <ChatGPTPage />;
      case 'spotify':
        return (
          <SpotifyPage 
            isPlaying={isPlaying} 
            onTogglePlay={togglePlay}
            currentSong={PLAYLIST[currentSongIndex]}
            onNext={nextSong}
            onPrevious={previousSong}
            isShuffled={isShuffled}
            onToggleShuffle={toggleShuffle}
          />
        );
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
    <div className="w-full h-screen bg-[#EEF0F3] dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
      {/* Custom Cursor */}
      <div
        className={`custom-cursor ${isHoveringInteractive ? 'hover' : ''}`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
      />

      {/* Dark Mode Toggle - Top Right */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        onMouseEnter={() => setIsHoveringInteractive(true)}
        onMouseLeave={() => setIsHoveringInteractive(false)}
        className="fixed top-6 right-6 z-50 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-200"
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
      <div 
        className="bg-[#FAFAFB] dark:bg-gray-800 rounded-[20px] flex flex-col overflow-hidden transition-all duration-300"
        style={{
          width: 'min(1280px, 92vw)',
          height: 'min(760px, 86vh)',
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.12), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Window Chrome - Header Area */}
        <div className="h-[52px] bg-gray-100 dark:bg-gray-800 border-b border-gray-200/60 dark:border-gray-700 flex items-center px-4">
          {/* Traffic Lights */}
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Tab Strip */}
          <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                onMouseEnter={() => setIsHoveringInteractive(true)}
                onMouseLeave={() => setIsHoveringInteractive(false)}
                className={`
                  group relative px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${activeTabId === tab.id 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-[12px]' 
                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full'
                  }
                `}
              >
                {tab.title}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    onMouseEnter={() => setIsHoveringInteractive(true)}
                    onMouseLeave={() => setIsHoveringInteractive(false)}
                    className="ml-2 opacity-0 group-hover:opacity-100 w-4 h-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </button>
            ))}
            <button
              onClick={() => addTab('newtab')}
              onMouseEnter={() => setIsHoveringInteractive(true)}
              onMouseLeave={() => setIsHoveringInteractive(false)}
              className="ml-1 w-7 h-7 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
              title="New Tab"
            >
              +
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {/* Playback Bar - Shows when music is playing and not on Spotify tab */}
      {(isPlaying || currentSongIndex > 0) && !isSpotifyTab && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div 
            onClick={goToSpotifyTab}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
            className="bg-white dark:bg-gray-800 rounded-full px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2 cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            {/* Shuffle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleShuffle();
              }}
              className={`w-8 h-8 flex items-center justify-center transition-opacity ${
                isShuffled 
                  ? 'text-gray-900 dark:text-white opacity-100' 
                  : 'text-gray-400 dark:text-gray-500 hover:opacity-70'
              }`}
              aria-label="Shuffle"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousSong();
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSong();
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>

            {/* Song Title */}
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {PLAYLIST[currentSongIndex]?.title || 'Overdrive'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
