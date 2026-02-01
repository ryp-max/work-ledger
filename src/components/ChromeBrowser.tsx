'use client';

import { useState, useCallback } from 'react';

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export function ChromeBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'chrome://newtab' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');

  const addTab = useCallback(() => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'chrome://newtab'
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      if (filtered.length === 0) {
        // If closing last tab, create a new one
        const newTab: Tab = { id: Date.now().toString(), title: 'New Tab', url: 'chrome://newtab' };
        return [newTab];
      }
      return filtered;
    });
    
    // If closing active tab, switch to another
    if (tabId === activeTabId) {
      setTabs(prev => {
        const filtered = prev.filter(t => t.id !== tabId);
        if (filtered.length > 0) {
          setActiveTabId(filtered[filtered.length - 1].id);
        }
        return filtered;
      });
    }
  }, [activeTabId]);

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Window Chrome */}
      <div className="h-8 bg-gray-200 flex items-center justify-between px-2 border-b border-gray-300">
        {/* Traffic Lights (macOS style) */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1"></div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-gray-200 flex items-end overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 min-w-[200px] max-w-[240px] cursor-pointer
              border-t border-l border-r border-gray-300 rounded-t-lg
              ${activeTabId === tab.id 
                ? 'bg-white border-b-white' 
                : 'bg-gray-300 hover:bg-gray-250'
              }
            `}
          >
            {tab.favicon && (
              <img src={tab.favicon} alt="" className="w-4 h-4" />
            )}
            <span className="flex-1 text-sm truncate text-gray-700">
              {tab.title}
            </span>
            <button
              onClick={(e) => closeTab(tab.id, e)}
              className="w-4 h-4 rounded hover:bg-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
        ))}
        {/* New Tab Button */}
        <button
          onClick={addTab}
          className="w-8 h-8 mx-1 rounded hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 text-xl"
          title="New Tab"
        >
          +
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center gap-2">
        <button className="text-gray-500 hover:text-gray-700">←</button>
        <button className="text-gray-500 hover:text-gray-700">→</button>
        <button className="text-gray-500 hover:text-gray-700">↻</button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <span className="text-gray-400 text-sm">🔒</span>
          <input
            type="text"
            value={activeTab.url}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white overflow-auto">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-4">{activeTab.title}</h1>
          <p className="text-gray-600">Content for {activeTab.url}</p>
        </div>
      </div>
    </div>
  );
}
