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
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load state on mount - ensure lamp is ON by default
  useEffect(() => {
    const loaded = loadState();
    // Force lamp ON on first load to avoid persisted "off" state
    setState({ ...loaded, lampOn: true });
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

  // Audio setup - play overdrive.mp3 and click sound
  useEffect(() => {
    audioRef.current = new Audio('/audio/overdrive.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    
    // Create click sound using Web Audio API (mechanical click)
    clickSoundRef.current = null; // Will use Web Audio instead
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play a cassette tape mechanical button click sound
  const playClickSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Create plastic cassette button "clunk" sound
      // Layer 1: Initial plastic impact (low thud)
      const thud = audioContext.createOscillator();
      const thudGain = audioContext.createGain();
      const thudFilter = audioContext.createBiquadFilter();
      
      thud.type = 'square';
      thud.frequency.setValueAtTime(150, audioContext.currentTime);
      thud.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.03);
      
      thudFilter.type = 'lowpass';
      thudFilter.frequency.setValueAtTime(400, audioContext.currentTime);
      
      thudGain.gain.setValueAtTime(0.4, audioContext.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06);
      
      thud.connect(thudFilter);
      thudFilter.connect(thudGain);
      thudGain.connect(audioContext.destination);
      
      thud.start(audioContext.currentTime);
      thud.stop(audioContext.currentTime + 0.06);
      
      // Layer 2: High plastic click
      const click = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      const clickFilter = audioContext.createBiquadFilter();
      
      click.type = 'square';
      click.frequency.setValueAtTime(2500, audioContext.currentTime);
      click.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.015);
      
      clickFilter.type = 'highpass';
      clickFilter.frequency.setValueAtTime(1000, audioContext.currentTime);
      
      clickGain.gain.setValueAtTime(0.15, audioContext.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02);
      
      click.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(audioContext.destination);
      
      click.start(audioContext.currentTime);
      click.stop(audioContext.currentTime + 0.02);
      
      // Layer 3: Noise burst for texture (plastic rattle)
      const bufferSize = audioContext.sampleRate * 0.04;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioContext.createBufferSource();
      noise.buffer = noiseBuffer;
      
      const noiseFilter = audioContext.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3000, audioContext.currentTime);
      noiseFilter.Q.setValueAtTime(2, audioContext.currentTime);
      
      const noiseGain = audioContext.createGain();
      noiseGain.gain.setValueAtTime(0.08, audioContext.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.03);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      
      noise.start(audioContext.currentTime);
    } catch {
      // Audio not supported, ignore
    }
  }, []);

  // Handle play state changes
  useEffect(() => {
    if (!audioRef.current || !state) return;
    
    if (state.isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked by browser, reset state
        setState(prev => prev ? { ...prev, isPlaying: false } : null);
      });
    } else {
      audioRef.current.pause();
    }
  }, [state?.isPlaying]);

  const togglePlay = useCallback(() => {
    playClickSound();
    setState(prev => prev ? { ...prev, isPlaying: !prev.isPlaying } : null);
    setShowPlayStatus(true);
    setTimeout(() => setShowPlayStatus(false), 2000);
  }, [playClickSound]);

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
        
        {/* WALKMAN BODY - larger hover area (behind play button) */}
        <div
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Walkman"
          style={{
            left: '6%',
            top: '52%',
            width: '20%',
            height: '24%',
            zIndex: 1,
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

        {/* WALKMAN PLAY BUTTON - positioned over the orange button (on top) */}
        <button
          onClick={togglePlay}
          className={`absolute cursor-pointer ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Play/Pause"
          style={{
            left: '14%',
            top: '63%',
            width: '9%',
            height: '7%',
            zIndex: 10,
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

        {/* LAMP HEAD - clickable to toggle lamp */}
        <button
          onClick={toggleLamp}
          className={`absolute cursor-pointer ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Lamp"
          style={{
            left: '77%',
            top: '8%',
            width: '23%',
            height: '32%',
            zIndex: 5,
          }}
          title={state.lampOn ? 'Turn off lamp' : 'Turn on lamp'}
        >
          {/* Lamp state indicator */}
          <div 
            className={`absolute top-2 right-2 w-3 h-3 rounded-full transition-all ${
              state.lampOn ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-gray-600/40'
            }`}
          />
        </button>

        {/* STICKY NOTE - editable */}
        <div
          className={`absolute cursor-text ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Sticky Note"
          style={{
            left: '62%',
            top: '14%',
            width: '12%',
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
            left: '31%',
            top: '34%',
            width: '25%',
            height: '46%',
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
            left: '56%',
            top: '34%',
            width: '25%',
            height: '46%',
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

        {/* MONTH TABS - top tabs on ledger */}
        <div
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Month Tabs (Top)"
          style={{
            left: '68%',
            top: '32%',
            width: '20%',
            height: '5%',
          }}
        >
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
            <button
              key={month}
              className="absolute cursor-pointer hover:bg-amber-200/10"
              style={{
                left: `${i * 16.6}%`,
                top: '0',
                width: '16.6%',
                height: '100%',
              }}
              onClick={() => setState(prev => prev ? { ...prev, currentMonth: i } : null)}
              title={`Go to ${month}`}
            >
              {state.currentMonth === i && (
                <div className="absolute inset-0 bg-amber-200/20 rounded-t" />
              )}
            </button>
          ))}
        </div>

        {/* MONTH TABS - side tabs on ledger */}
        <div
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
          data-label="Month Tabs (Side)"
          style={{
            left: '79%',
            top: '33%',
            width: '4%',
            height: '28%',
          }}
        >
          {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
            <button
              key={month}
              className="absolute cursor-pointer hover:bg-amber-200/10"
              style={{
                left: '0',
                top: `${i * 16.6}%`,
                width: '100%',
                height: '16.6%',
              }}
              onClick={() => setState(prev => prev ? { ...prev, currentMonth: i + 6 } : null)}
              title={`Go to ${month}`}
            >
              {state.currentMonth === i + 6 && (
                <div className="absolute inset-0 bg-amber-200/20 rounded-r" />
              )}
            </button>
          ))}
        </div>

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
