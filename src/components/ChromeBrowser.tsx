'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playKeyboardClick } from '@/lib/keyboard-sound';
import { NewTabPage } from './pages/NewTabPage';
import { WeeklyLogPage } from './pages/WeeklyLogPage';
import { PhotosPage } from './pages/PhotosPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { GamesPage } from './pages/GamesPage';
import { SpotifyPage } from './pages/SpotifyPage';

export type PageType = 'newtab' | 'weekly-log' | 'photos' | 'guestbook' | 'games' | 'spotify' | 'url';

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
  { id: 'games', title: 'Games', url: 'chrome://games', icon: '🎮' },
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
  const [isClosed, setIsClosed] = useState(false);
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    };
    return favicons[pageType];
  }, []);

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
      favicon: getFavicon(pageType, url),
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs, getFavicon]);

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
    
    if (input.includes('game') || input.includes('2048') || input.includes('wordle') || input === '') {
      addTab('games', 'chrome://games', 'Games');
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
        playSong(currentSongIndex);
      } else {
        // Auto-play next song when current ends
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
    
    const wasPlaying = isPlaying;
    const currentSrc = audioRef.current.src.replace(window.location.origin, '');
    const newSrc = PLAYLIST[currentSongIndex].src;
    
    if (currentSrc !== newSrc) {
      audioRef.current.pause();
      audioRef.current.src = newSrc;
      audioRef.current.load();
      setCurrentTime(0);
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
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


  // Global click handler for keyboard sound
  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full h-screen bg-[#EEF0F3] dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
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

      {/* Dark Mode Toggle - Top Right */}
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-50 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center"
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

      {/* Browser Window */}
      <AnimatePresence>
        {!isClosed && (
          <motion.div 
            className="bg-[#FAFAFB] dark:bg-gray-800 rounded-[20px] flex flex-col overflow-hidden shadow-2xl"
            style={{
              width: 'min(1280px, 92vw)',
              height: 'min(760px, 86vh)',
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
        {/* Window Chrome - Header Area */}
        <div className="h-[48px] bg-[#E8F0FE] dark:bg-[#2D2D2D] border-b border-gray-300/30 dark:border-gray-700 flex items-end pb-0 relative z-10">
          {/* Traffic Lights */}
          <div className="flex gap-1.5 ml-4 mr-4 mb-2 items-center">
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsClosed(true);
              }}
              className="relative z-50 flex-shrink-0 p-1 -m-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              type="button"
            >
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
            </motion.button>
            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
          </div>
          
          {/* Tab Strip */}
          <div className="flex-1 flex items-end gap-0.5 overflow-x-auto scrollbar-hide h-full">
            <AnimatePresence mode="popLayout">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`
                    group relative flex items-center gap-2 px-4 py-2 text-sm font-normal whitespace-nowrap
                    ${activeTabId === tab.id 
                      ? 'bg-white dark:bg-[#3C3C3C] text-gray-900 dark:text-gray-100 rounded-t-lg border-t border-x border-gray-300/30 dark:border-gray-600 min-w-[160px] max-w-[240px]' 
                      : 'bg-[#E8F0FE] dark:bg-[#35363A] text-gray-700 dark:text-gray-300 hover:bg-[#DCE8F8] dark:hover:bg-[#3F4043] rounded-t-lg border-t border-x border-transparent min-w-[120px] max-w-[200px]'
                    }
                  `}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -2 }}
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
                    onClick={(e) => closeTab(tab.id, e)}
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
              ))}
            </AnimatePresence>
            
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
              className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
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

                {/* Song Title */}
                <motion.div 
                  className="flex items-center gap-3 ml-2 flex-1 min-w-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                      {PLAYLIST[currentSongIndex]?.title || 'Overdrive'}
                    </div>
                    {PLAYLIST[currentSongIndex]?.artist && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
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
