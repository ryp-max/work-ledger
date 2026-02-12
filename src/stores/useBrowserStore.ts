import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageType = 'newtab' | 'weekly-log' | 'daily-log' | 'photos' | 'guestbook' | 'games' | 'spotify' | 'rachel' | 'url';

const getFavicon = (pageType: PageType, url?: string): string | undefined => {
  if (url?.startsWith('http://') || url?.startsWith('https://')) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return undefined;
    }
  }
  const favicons: Record<PageType, string> = {
    newtab: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    spotify: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.36.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
    games: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M15.5 12c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zm-2.5-8c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S18.02 4 13 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
    'weekly-log': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
    'daily-log': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
    photos: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
    guestbook: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
    rachel: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F59E0B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>',
  };
  return favicons[pageType];
};

export interface Tab {
  id: string;
  title: string;
  pageType: PageType;
  url: string;
  favicon?: string;
  data?: { initialQuery?: string };
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string;
  darkMode: boolean;
  isClosed: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
  setTabs: (tabs: Tab[] | ((prev: Tab[]) => Tab[])) => void;
  setActiveTabId: (id: string) => void;
  setDarkMode: (value: boolean) => void;
  setIsClosed: (value: boolean) => void;
  setIsMinimized: (value: boolean) => void;
  setIsFullscreen: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setAudioEnabled: (value: boolean) => void;
  addTab: (pageType: PageType, url?: string, title?: string, data?: Tab['data']) => void;
  closeTab: (tabId: string) => void;
  reorderTabs: (oldIndex: number, newIndex: number) => void;
}

const DEFAULT_TABS: Tab[] = [
  { id: '1', title: 'Home', pageType: 'newtab', url: 'chrome://newtab' },
];

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      tabs: DEFAULT_TABS,
      activeTabId: '1',
      darkMode: false,
      isClosed: false,
      isMinimized: false,
      isFullscreen: false,
      reducedMotion: false,
      audioEnabled: true,

      setTabs: (tabs) =>
        set({ tabs: typeof tabs === 'function' ? tabs(get().tabs) : tabs }),
      setActiveTabId: (id) => set({ activeTabId: id }),
      setDarkMode: (value) => set({ darkMode: value }),
      setIsClosed: (value) => set({ isClosed: value }),
      setIsMinimized: (value) => set({ isMinimized: value }),
      setIsFullscreen: (value) => set({ isFullscreen: value }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setAudioEnabled: (value) => set({ audioEnabled: value }),

      addTab: (pageType, url, title, data) => {
        const { tabs } = get();
        if (pageType === 'spotify') {
          const existing = tabs.find((t) => t.pageType === 'spotify');
          if (existing) {
            set({ activeTabId: existing.id });
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
        set({
          tabs: [...tabs, newTab],
          activeTabId: newTab.id,
        });
      },

      closeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        if (tabs.length <= 1) return;
        const filtered = tabs.filter((t) => t.id !== tabId);
        const newActiveId =
          tabId === activeTabId && filtered.length > 0
            ? filtered[filtered.length - 1].id
            : activeTabId;
        set({ tabs: filtered, activeTabId: newActiveId });
      },

      reorderTabs: (oldIndex, newIndex) => {
        const { tabs } = get();
        const newTabs = [...tabs];
        const [removed] = newTabs.splice(oldIndex, 1);
        newTabs.splice(newIndex, 0, removed);
        set({ tabs: newTabs });
      },
    }),
    {
      name: 'work-ledger-browser',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        darkMode: state.darkMode,
        reducedMotion: state.reducedMotion,
        audioEnabled: state.audioEnabled,
      }),
    }
  )
);
