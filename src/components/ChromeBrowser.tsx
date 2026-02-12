'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { playKeyboardClick } from '@/lib/keyboard-sound';
import { NewTabPage } from './pages/NewTabPage';
import { WeeklyLogPage } from './pages/WeeklyLogPage';
import { PhotosPage } from './pages/PhotosPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { GamesPage } from './pages/GamesPage';
import { SpotifyPage } from './pages/SpotifyPage';
import { RachelChatPage } from './pages/RachelChatPage';

export type PageType = 'newtab' | 'weekly-log' | 'photos' | 'guestbook' | 'games' | 'spotify' | 'rachel' | 'url';

export interface Tab {
  id: string;
  title: string;
  pageType: PageType;
  url: string;
  favicon?: string;
  data?: { initialQuery?: string };
}

const DEFAULT_TABS: Tab[] = [
  { id: '1', title: 'Home', pageType: 'newtab', url: 'chrome://newtab' },
];

export const BOOKMARKS = [
  { id: 'weekly-log', title: 'Weekly Log', url: 'chrome://weekly-log', icon: '📝' },
  { id: 'games', title: 'Games', url: 'chrome://games', icon: '🎮' },
  { id: 'spotify', title: 'Spotify', url: 'https://open.spotify.com', icon: '🎵' },
  { id: 'photos', title: 'Photos', url: 'chrome://photos', icon: '📷' },
  { id: 'guestbook', title: 'Guestbook', url: 'chrome://guestbook', icon: '✍️' },
];

export function ChromeBrowser() {
  // Load tabs from localStorage or use defaults
  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workLedgerTabs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_TABS;
        }
      }
    }
    return DEFAULT_TABS;
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workLedgerActiveTab');
      return saved || '1';
    }
    return '1';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reducedMotion');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audioEnabled');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  const omniboxRef = useRef<HTMLInputElement>(null);
  
  // Playlist
  const PLAYLIST = [
    { id: 1, title: 'Overdrive', artist: 'TWC', src: '/audio/overdrive.mp3', albumCover: '/images/album-covers/overdrive.jpg' },
    { id: 2, title: 'Beautiful Escape (feat. Zak Abel)', artist: 'Tom Misch', src: '/audio/Beautiful Escape (feat. Zak Abel) Tom Misch.mp3', albumCover: '/images/album-covers/beautiful-escape.jpg' },
    { id: 3, title: 'Take Care', artist: 'GUMMY (거미), Dynamicduo (다이나믹 듀오)', src: '/audio/Take Care.mp3', albumCover: '/images/album-covers/take-care.jpg' },
    { id: 4, title: 'We Are', artist: 'Woo, Loco, GRAY', src: '/audio/We Are.mp3', albumCover: '/images/album-covers/we-are.jpg' },
    { id: 5, title: 'Aperture', artist: 'Harry Styles', src: '/audio/Aperture.mp3', albumCover: '/images/album-covers/aperture.jpg' },
    { id: 6, title: 'Magnetic', artist: 'ILLIT', src: '/audio/Magnetic.mp3', albumCover: '/images/album-covers/magnetic.jpg' },
    { id: 7, title: 'Internet Girl', artist: 'KATSEYE', src: '/audio/Internet Girl.mp3', albumCover: '/images/album-covers/internet-girl.jpg' },
  ];

  // Audio state - persists across tab switches
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlayRef = useRef(false);

  // Shuffle array function (Fisher-Yates algorithm)
  const shuffleArray = useCallback((array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Initialize shuffled order when shuffle is enabled
  useEffect(() => {
    if (isShuffled) {
      const indices = PLAYLIST.map((_, i) => i);
      const shuffled = shuffleArray(indices);
      const currentIndex = shuffled.indexOf(currentSongIndex);
      if (currentIndex === 0 && shuffled.length > 1) {
        const swapIndex = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
        [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
      }
      setShuffledOrder(shuffled);
      setShuffleIndex(shuffled.indexOf(currentSongIndex));
    }
  }, [isShuffled, shuffleArray, currentSongIndex]);

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

  // Keyboard shortcuts will be set up after addTab is defined

  // Get favicon for page type
  const getFavicon = useCallback((pageType: PageType, url?: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
      } catch {
        return undefined;
      }
    }
    
    // Default favicons for internal pages
    const favicons: Record<PageType, string> = {
      'newtab': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      'spotify': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.36.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
      'games': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M15.5 12c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zm-2.5-8c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S18.02 4 13 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
      'weekly-log': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
      'photos': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
      'guestbook': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
      'url': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
      'rachel': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F59E0B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>',
    };
    return favicons[pageType];
  }, []);

  const addTab = useCallback((pageType: PageType = 'newtab', url?: string, title?: string, data?: Tab['data']) => {
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
      favicon: getFavicon(pageType, url),
      ...(data && { data }),
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs, getFavicon]);

  // Persist tabs to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workLedgerTabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  // Persist active tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workLedgerActiveTab', activeTabId);
    }
  }, [activeTabId]);

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

  // Drag and drop sensors with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for tab reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        return newItems;
      });
    }
  }, []);

  // Sortable Tab Component
  const SortableTab = ({ tab }: { tab: Tab }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: tab.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <motion.button
        ref={setNodeRef}
        style={{ ...style, paddingLeft: '8px', paddingRight: '8px' }}
        {...attributes}
        {...listeners}
        onClick={() => switchTab(tab.id)}
        className={`
          group relative flex items-center gap-2 py-3 text-sm font-normal whitespace-nowrap cursor-grab active:cursor-grabbing
          ${activeTabId === tab.id 
            ? 'bg-white dark:bg-[#3C3C3C] text-gray-900 dark:text-gray-100 rounded-t-lg border-t border-x border-gray-300/30 dark:border-gray-600 min-w-[160px] max-w-[240px]' 
            : 'bg-[#E8F0FE] dark:bg-[#35363A] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#3C3C3C] rounded-t-lg border-t border-x border-transparent min-w-[120px] max-w-[200px]'
          }
        `}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Favicon */}
        <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
          {tab.favicon ? (
            <img src={tab.favicon} alt="" className="w-4 h-4" />
          ) : (
            <div className={`w-4 h-4 rounded ${activeTabId === tab.id ? 'bg-gray-400 dark:bg-gray-500' : 'bg-gray-500 dark:bg-gray-600'}`}></div>
          )}
        </div>
        
        {/* Tab Title */}
        <span className="flex-1 truncate text-left">{tab.title}</span>
        
        {/* Close Button */}
        {tabs.length > 1 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id, e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              activeTabId === tab.id
                ? 'opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.button>
    );
  };

  const handleOmniboxSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    const input = trimmed.toLowerCase();
    
    if (input === '') return;
    
    if (input.includes('game') || input.includes('2048') || input.includes('wordle')) {
      addTab('games', 'chrome://games', 'Games');
      return;
    }
    
    // Only open as URL if explicitly typed with http:// or https://
    // Everything else goes to Rachel — "Ask me anything" is for the AI agent
    if (input.startsWith('http://') || input.startsWith('https://')) {
      addTab('url', trimmed, new URL(trimmed).hostname);
      return;
    }
    
    // Open Rachel chat (ChatGPT + agent) for ALL other queries
    const title = trimmed.length > 24 ? `${trimmed.slice(0, 24)}...` : trimmed;
    addTab('rachel', 'chrome://rachel', `Rachel: ${title || 'Chat'}`, {
      initialQuery: trimmed,
    });
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

  // Keyboard shortcuts: ⌘L focuses omnibox, ⌘1-5 switches tabs, ⌘W closes active tab, ⌘T opens new tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;
      
      // Focus omnibox with ⌘L (or Ctrl+L)
      if (modifierKey && e.key === 'l') {
        e.preventDefault();
        e.stopPropagation();
        omniboxRef.current?.focus();
        omniboxRef.current?.select();
        return;
      }
      
      // Tab switching with ⌘1-5 (or Ctrl+1-5)
      if (modifierKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        e.stopPropagation();
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
          setActiveTabId(tabs[tabIndex].id);
        }
        return;
      }
      
      // Close active tab with ⌘W (or Ctrl+W)
      if (modifierKey && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (tabs.length > 1 && activeTabId) {
          setTabs(prev => {
            const filtered = prev.filter(t => t.id !== activeTabId);
            // Switch to the last remaining tab
            if (filtered.length > 0) {
              setActiveTabId(filtered[filtered.length - 1].id);
            }
            return filtered;
          });
        }
        return;
      }
      
      // Open new tab with ⌘T (or Ctrl+T) and focus search bar
      if (modifierKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        addTab('newtab');
        // Focus the search bar after a short delay to ensure the tab is rendered
        setTimeout(() => {
          omniboxRef.current?.focus();
          omniboxRef.current?.select();
        }, 50);
        return;
      }
    };
    // Use capture phase to catch the event before it reaches the browser
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [tabs, activeTabId, addTab]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const isSpotifyTab = activeTab.pageType === 'spotify';

  // Audio control functions
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // Pause at current position - don't reset
      audioRef.current.pause();
    } else {
      // Resume from current position - don't reload
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  }, [isPlaying]);

  const playSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
    // Update shuffle index if shuffle is enabled
    if (isShuffled && shuffledOrder.length > 0) {
      const newShuffleIndex = shuffledOrder.indexOf(index);
      if (newShuffleIndex !== -1) {
        setShuffleIndex(newShuffleIndex);
      }
    }
  }, [isShuffled, shuffledOrder]);

  const nextSong = useCallback(() => {
    if (isShuffled && shuffledOrder.length > 0) {
      let nextShuffleIndex = shuffleIndex + 1;
      if (nextShuffleIndex >= shuffledOrder.length) {
        const newShuffled = shuffleArray(PLAYLIST.map((_, i) => i));
        setShuffledOrder(newShuffled);
        setShuffleIndex(0);
        playSong(newShuffled[0]);
      } else {
        setShuffleIndex(nextShuffleIndex);
        playSong(shuffledOrder[nextShuffleIndex]);
      }
    } else {
      const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
      playSong(nextIndex);
    }
  }, [currentSongIndex, isShuffled, shuffledOrder, shuffleIndex, shuffleArray, playSong]);

  const previousSong = useCallback(() => {
    if (isShuffled && shuffledOrder.length > 0) {
      let prevShuffleIndex = shuffleIndex - 1;
      if (prevShuffleIndex < 0) {
        prevShuffleIndex = shuffledOrder.length - 1;
      }
      setShuffleIndex(prevShuffleIndex);
      playSong(shuffledOrder[prevShuffleIndex]);
    } else {
      const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      playSong(prevIndex);
    }
  }, [currentSongIndex, isShuffled, shuffledOrder, shuffleIndex, playSong]);

  const toggleShuffle = useCallback(() => {
    const newShuffledState = !isShuffled;
    setIsShuffled(newShuffledState);
    
    if (newShuffledState) {
      const indices = PLAYLIST.map((_, i) => i);
      const shuffled = shuffleArray(indices);
      const currentIndex = shuffled.indexOf(currentSongIndex);
      if (currentIndex === 0 && shuffled.length > 1) {
        const swapIndex = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
        [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
      }
      setShuffledOrder(shuffled);
      setShuffleIndex(shuffled.indexOf(currentSongIndex));
    } else {
      setShuffledOrder([]);
      setShuffleIndex(0);
    }
  }, [isShuffled, currentSongIndex, shuffleArray]);

  const toggleRepeat = useCallback(() => {
    setIsRepeating(!isRepeating);
  }, [isRepeating]);


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
      audioRef.current.volume = volume;
      
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

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Track audio progress
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [currentSongIndex]);

  // Handle song ended event
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleEnded = () => {
      setIsPlaying(false);
      
      if (isRepeating) {
        // If repeating, play the same song again
        shouldAutoPlayRef.current = true;
        playSong(currentSongIndex);
      } else {
        // Auto-play next song when current ends
        shouldAutoPlayRef.current = true;
        if (isShuffled && shuffledOrder.length > 0) {
          let nextShuffleIndex = shuffleIndex + 1;
          if (nextShuffleIndex >= shuffledOrder.length) {
            const newShuffled = shuffleArray(PLAYLIST.map((_, i) => i));
            setShuffledOrder(newShuffled);
            setShuffleIndex(0);
            playSong(newShuffled[0]);
          } else {
            setShuffleIndex(nextShuffleIndex);
            playSong(shuffledOrder[nextShuffleIndex]);
          }
        } else {
          const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
          playSong(nextIndex);
        }
      }
    };
    
    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSongIndex, isRepeating, isShuffled, shuffledOrder, shuffleIndex, shuffleArray, playSong]);

  // Update audio source when song changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    const wasPlaying = isPlaying || shouldAutoPlayRef.current;
    const currentSrc = audioRef.current.src.replace(window.location.origin, '');
    const newSrc = PLAYLIST[currentSongIndex].src;
    
    if (currentSrc !== newSrc) {
      audioRef.current.pause();
      audioRef.current.src = newSrc;
      audioRef.current.load();
      setCurrentTime(0);
      if (wasPlaying) {
        setIsPlaying(true);
        shouldAutoPlayRef.current = false;
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSongIndex, isPlaying]);

  // Format time helper
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const renderContent = () => {
    switch (activeTab.pageType) {
      case 'newtab':
        return (
          <NewTabPage 
            onBookmarkClick={handleBookmarkClick}
            onOmniboxSubmit={handleOmniboxSubmit}
            omniboxRef={omniboxRef}
          />
        );
      case 'weekly-log':
        return <WeeklyLogPage />;
      case 'photos':
        return <PhotosPage />;
      case 'guestbook':
        return <GuestbookPage />;
      case 'games':
        return <GamesPage />;
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
            isRepeating={isRepeating}
            onToggleRepeat={toggleRepeat}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            formatTime={formatTime}
          />
        );
      case 'rachel':
        return (
          <RachelChatPage initialQuery={activeTab.data?.initialQuery} />
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


  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reducedMotion', JSON.stringify(reducedMotion));
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioEnabled', JSON.stringify(audioEnabled));
    }
  }, [audioEnabled]);

  // Apply reduced motion class
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Global click handler for keyboard sound
  useEffect(() => {
    if (!audioEnabled) return;
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip if clicking on input/textarea (typing)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Only play sound for interactive elements (buttons, links, clickable divs)
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      if (isInteractive) {
        playKeyboardClick();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [audioEnabled]);

  return (
    <div className="w-full h-screen bg-[#EEF0F3] dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
      {/* Minimized Indicator */}
      <AnimatePresence>
        {isMinimized && !isClosed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.button
              onClick={() => setIsMinimized(false)}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Restore Window
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chrome Icon - Shown when browser is closed */}
      <AnimatePresence>
        {isClosed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-40"
          >
            <motion.button
              onClick={() => setIsClosed(false)}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white" opacity="0.3"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="white" opacity="0.5"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Toggles - Top Right */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {/* Reduced Motion Toggle */}
        <motion.button
          onClick={() => setReducedMotion(!reducedMotion)}
          className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center"
          whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          title={reducedMotion ? 'Enable animations' : 'Reduce motion'}
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </motion.button>
        
        {/* Audio Toggle */}
        <motion.button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center"
          whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          title={audioEnabled ? 'Disable sounds' : 'Enable sounds'}
        >
          {audioEnabled ? (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </motion.button>
        
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center"
          whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
        </motion.button>
      </div>

      {/* Browser Window */}
      <AnimatePresence>
        {!isClosed && !isMinimized && (
          <motion.div 
            className="bg-[#FAFAFB] dark:bg-gray-800 flex flex-col overflow-hidden shadow-2xl"
            style={{
              width: isFullscreen ? '100vw' : 'min(1280px, 92vw)',
              height: isFullscreen ? '100vh' : 'min(760px, 86vh)',
              borderRadius: isFullscreen ? '0' : '20px',
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              borderRadius: isFullscreen ? 0 : 20,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
        {/* Window Chrome - Header Area */}
        <div className="h-[48px] bg-[#E8F0FE] dark:bg-[#2D2D2D] border-b border-gray-300/30 dark:border-gray-700 flex items-end pb-0 relative z-10">
          {/* Traffic Lights */}
          <div className="flex gap-1.5 mb-2 items-center" style={{ marginLeft: '8px', marginRight: '8px' }}>
            {/* Red - Close */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playKeyboardClick();
                setIsClosed(true);
              }}
              className="relative z-50 flex-shrink-0 p-1 -m-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              type="button"
              title="Close window"
            >
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
            </motion.button>
            {/* Yellow - Minimize */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playKeyboardClick();
                setIsMinimized(!isMinimized);
              }}
              className="relative z-50 flex-shrink-0 p-1 -m-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              type="button"
              title="Minimize window"
            >
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
            </motion.button>
            {/* Green - Fullscreen */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playKeyboardClick();
                setIsFullscreen(!isFullscreen);
              }}
              className="relative z-50 flex-shrink-0 p-1 -m-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              type="button"
              title="Toggle fullscreen"
            >
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
            </motion.button>
          </div>
          
          {/* Tab Strip */}
          <div className="flex-1 flex items-end gap-0.5 overflow-x-auto scrollbar-hide h-full">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tabs.map(tab => tab.id)}
                strategy={horizontalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {tabs.map((tab) => (
                    <SortableTab key={tab.id} tab={tab} />
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
            
            {/* New Tab Button */}
            <motion.button
              onClick={() => addTab('newtab')}
              className="ml-1 mb-0.5 w-8 h-8 rounded-full bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              title="New Tab"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <motion.div 
          className="flex-1 overflow-hidden"
          key={activeTabId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {renderContent()}
        </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playback Bar - Shows when music is playing and not on Spotify tab */}
      <AnimatePresence>
        {(isPlaying || currentSongIndex > 0) && !isSpotifyTab && (
          <motion.div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 pr-6 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
              style={{ width: 'fit-content', maxWidth: '500px' }}
              onClick={goToSpotifyTab}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Progress Bar */}
              <div className="mb-3">
                <div 
                  onClick={goToSpotifyTab}
                  className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                </div>
              </div>
              
              <div 
                onClick={goToSpotifyTab}
                className="flex items-center gap-2"
              >
                {/* Shuffle Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShuffle();
                  }}
                  className={`w-8 h-8 flex items-center justify-center ${
                    isShuffled 
                      ? 'text-gray-900 dark:text-white opacity-100' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                  whileHover={{ scale: 1.15, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  aria-label="Shuffle"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                  </svg>
                </motion.button>

                {/* Previous Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousSong();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white"
                  whileHover={{ scale: 1.15, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </motion.button>

                {/* Play/Pause Button - Centered */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
                </motion.button>

                {/* Next Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSong();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white"
                  whileHover={{ scale: 1.15, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </motion.button>

                {/* Repeat Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRepeat();
                  }}
                  className={`w-8 h-8 flex items-center justify-center ${
                    isRepeating 
                      ? 'text-gray-900 dark:text-white opacity-100' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  aria-label="Repeat"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/>
                  </svg>
                </motion.button>

                {/* Volume Control */}
                <div 
                  className="flex items-center gap-2 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVolume(volume === 0 ? 1 : 0);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {volume === 0 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      </svg>
                    ) : volume < 0.5 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.83 16h-1.41l-1.47-1.47c1.18-.84 1.96-2.18 1.96-3.75 0-2.62-2.01-4.78-4.64-5.07V3c0-.28-.22-.5-.5-.5s-.5.22-.5.5v1.21c-.5.1-.97.28-1.4.52L5.52 3.16c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41L18.83 16zm-2.83-6c0 1.1-.9 2-2 2h-.5l-2-2H16c1.1 0 2 .9 2 2zM3 9v6h4l5 5V4L7 9H3z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </motion.button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                    }}
                    className="w-20 h-1 rounded-full appearance-none cursor-pointer volume-slider bg-gray-200 dark:bg-gray-700"
                    style={{
                      background: darkMode 
                        ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, rgb(75, 85, 99) ${volume * 100}%, rgb(75, 85, 99) 100%)`
                        : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, rgb(229, 231, 235) ${volume * 100}%, rgb(229, 231, 235) 100%)`
                    }}
                  />
                </div>

                {/* Song Title */}
                <motion.div 
                  className="flex items-center gap-3 ml-2 flex-1 min-w-0 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex-1 min-w-0 overflow-hidden relative pr-2 rounded-r-2xl">
                    {/* White gradient fade on the right - inside corner radius */}
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none dark:hidden rounded-r-2xl"
                      style={{
                        background: 'linear-gradient(to right, transparent, white)'
                      }}
                    />
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none hidden dark:block rounded-r-2xl"
                      style={{
                        background: 'linear-gradient(to right, transparent, rgb(31, 41, 55))'
                      }}
                    />
                    
                    {/* Song title */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                      {PLAYLIST[currentSongIndex]?.title || 'Overdrive'}
                    </div>
                    
                    {/* Artist name */}
                    {PLAYLIST[currentSongIndex]?.artist && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate mt-0.5">
                        {PLAYLIST[currentSongIndex]?.artist}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
