'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadState, saveState, type WorkbenchState } from '@/lib/workbench-store';

export function PhotoWorkbench() {
  const [state, setState] = useState<WorkbenchState | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [editingSticky, setEditingSticky] = useState(false);
  const [editingLeftPage, setEditingLeftPage] = useState(false);
  const [editingRightPage, setEditingRightPage] = useState(false);
  const [showPlayStatus, setShowPlayStatus] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save state on change
  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  // Debug mode toggle (D key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (!editingSticky && !editingLeftPage && !editingRightPage) {
          setDebugMode(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingSticky, editingLeftPage, editingRightPage]);

  // Audio is optional - only set up if file exists
  useEffect(() => {
    // No audio needed for now
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => prev ? { ...prev, isPlaying: !prev.isPlaying } : null);
    setShowPlayStatus(true);
    setTimeout(() => setShowPlayStatus(false), 2000);
  }, []);

  const toggleLamp = useCallback(() => {
    setState(prev => prev ? { ...prev, lampOn: !prev.lampOn } : null);
  }, []);

  const updateStickyNote = useCallback((text: string) => {
    setState(prev => prev ? { ...prev, stickyNote: text } : null);
  }, []);

  const updateLeftPage = useCallback((text: string) => {
    setState(prev => {
      if (!prev) return null;
      const entries = [...prev.ledgerEntries];
      if (entries[0]) {
        entries[0] = { ...entries[0], leftPage: text };
      }
      return { ...prev, ledgerEntries: entries };
    });
  }, []);

  const updateRightPage = useCallback((text: string) => {
    setState(prev => {
      if (!prev) return null;
      const entries = [...prev.ledgerEntries];
      if (entries[0]) {
        entries[0] = { ...entries[0], rightPage: text };
      }
      return { ...prev, ledgerEntries: entries };
    });
  }, []);

  if (!state) {
    return (
      <div className="w-full h-screen bg-[#2a2520] flex items-center justify-center">
        <div className="text-amber-100/50">Loading...</div>
      </div>
    );
  }

  const currentEntry = state.ledgerEntries[0];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#2a2520]"
    >
      {/* Background Photo - THE UI */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/workbench.jpg)',
        }}
      />

      {/* Dim overlay when lamp is off */}
      <div 
        className={`absolute inset-0 dim-overlay vignette pointer-events-none transition-opacity duration-500 ${
          state.lampOn ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* === HITBOX OVERLAY LAYER === */}
      <div className="absolute inset-0">
        
        {/* WALKMAN PLAY BUTTON - positioned over the orange button */}
        <button
          onClick={togglePlay}
          className={`absolute cursor-pointer ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Play/Pause"
          style={{
            left: '8%',
            top: '48%',
            width: '4%',
            height: '6%',
          }}
          title={state.isPlaying ? 'Pause' : 'Play'}
        >
          {/* Subtle overlay indicator when playing */}
          {state.isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full play-indicator" />
            </div>
          )}
        </button>

        {/* WALKMAN BODY - larger click area */}
        <div
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Walkman"
          style={{
            left: '3%',
            top: '38%',
            width: '12%',
            height: '20%',
          }}
          onMouseEnter={() => setShowPlayStatus(true)}
          onMouseLeave={() => setShowPlayStatus(false)}
        >
          {/* Play status text - only on hover */}
          {showPlayStatus && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded whitespace-nowrap">
              {state.isPlaying ? '♫ Playing...' : 'Click ▶ to play'}
            </div>
          )}
        </div>

        {/* LAMP SWITCH - positioned over the lamp */}
        <button
          onClick={toggleLamp}
          className={`absolute cursor-pointer ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Lamp Switch"
          style={{
            left: '78%',
            top: '18%',
            width: '8%',
            height: '25%',
          }}
          title={state.lampOn ? 'Turn off lamp' : 'Turn on lamp'}
        >
          {/* Subtle lamp state indicator */}
          <div 
            className={`absolute bottom-2 right-2 w-2 h-2 rounded-full transition-colors ${
              state.lampOn ? 'bg-yellow-400/60' : 'bg-gray-600/40'
            }`}
          />
        </button>

        {/* STICKY NOTE - editable */}
        <div
          className={`absolute cursor-text ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Sticky Note"
          style={{
            left: '52%',
            top: '8%',
            width: '10%',
            height: '12%',
          }}
          onClick={() => setEditingSticky(true)}
        >
          {editingSticky ? (
            <textarea
              autoFocus
              value={state.stickyNote}
              onChange={(e) => updateStickyNote(e.target.value)}
              onBlur={() => setEditingSticky(false)}
              className="sticky-textarea p-2"
              placeholder="Notes..."
              style={{
                transform: 'rotate(-2deg)',
              }}
            />
          ) : (
            <div 
              className="w-full h-full p-2 handwriting text-sm text-gray-800 overflow-hidden"
              style={{
                transform: 'rotate(-2deg)',
              }}
            >
              {state.stickyNote || <span className="text-gray-400/50 text-xs">Click to add note</span>}
            </div>
          )}
        </div>

        {/* LEDGER LEFT PAGE */}
        <div
          className={`absolute cursor-text ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Left Page"
          style={{
            left: '24%',
            top: '32%',
            width: '20%',
            height: '40%',
          }}
          onClick={() => setEditingLeftPage(true)}
        >
          {editingLeftPage ? (
            <textarea
              autoFocus
              value={currentEntry?.leftPage || ''}
              onChange={(e) => updateLeftPage(e.target.value)}
              onBlur={() => setEditingLeftPage(false)}
              className="ledger-textarea p-4"
              placeholder="Write here..."
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 30px, rgba(0,0,0,0.05) 30px, rgba(0,0,0,0.05) 31px)',
                backgroundPosition: '0 8px',
              }}
            />
          ) : (
            <div 
              className="w-full h-full p-4 handwriting text-lg text-gray-800 overflow-hidden whitespace-pre-wrap"
              style={{
                lineHeight: '31px',
              }}
            >
              {currentEntry?.leftPage || <span className="text-gray-500/30 text-base">Click to write...</span>}
            </div>
          )}
        </div>

        {/* LEDGER RIGHT PAGE */}
        <div
          className={`absolute cursor-text ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Right Page"
          style={{
            left: '48%',
            top: '32%',
            width: '20%',
            height: '40%',
          }}
          onClick={() => setEditingRightPage(true)}
        >
          {editingRightPage ? (
            <textarea
              autoFocus
              value={currentEntry?.rightPage || ''}
              onChange={(e) => updateRightPage(e.target.value)}
              onBlur={() => setEditingRightPage(false)}
              className="ledger-textarea p-4"
              placeholder="Write here..."
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 30px, rgba(0,0,0,0.05) 30px, rgba(0,0,0,0.05) 31px)',
                backgroundPosition: '0 8px',
              }}
            />
          ) : (
            <div 
              className="w-full h-full p-4 handwriting text-lg text-gray-800 overflow-hidden whitespace-pre-wrap"
              style={{
                lineHeight: '31px',
              }}
            >
              {currentEntry?.rightPage || <span className="text-gray-500/30 text-base">Click to write...</span>}
            </div>
          )}
        </div>

        {/* MONTH TABS - on the right side of ledger */}
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
          <button
            key={month}
            className={`absolute cursor-pointer ${debugMode ? 'debug-hitbox' : ''}`}
            data-label={month}
            style={{
              left: '68%',
              top: `${35 + i * 6}%`,
              width: '3%',
              height: '5%',
            }}
            onClick={() => setState(prev => prev ? { ...prev, currentMonth: i } : null)}
            title={`Go to ${month}`}
          >
            {state.currentMonth === i && (
              <div className="absolute inset-0 bg-amber-200/20 rounded-r" />
            )}
          </button>
        ))}

        {/* POLAROIDS on right page - decorative but could be clickable */}
        <div
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Polaroids"
          style={{
            left: '54%',
            top: '38%',
            width: '12%',
            height: '28%',
          }}
        />

      </div>

      {/* Debug mode indicator */}
      {debugMode && (
        <div className="fixed top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded z-50">
          DEBUG MODE (Press D to toggle)
        </div>
      )}

      {/* Minimal instructions - bottom right, very subtle */}
      <div className="fixed bottom-4 right-4 text-[10px] text-white/30 text-right">
        <p>Press D for debug view</p>
      </div>
    </div>
  );
}
