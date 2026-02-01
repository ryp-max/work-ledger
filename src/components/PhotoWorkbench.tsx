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
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
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

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Audio setup - play overdrive.mp3 and click sound
  useEffect(() => {
    audioRef.current = new Audio('/audio/overdrive.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    
    // Initialize AudioContext for sound effects
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Play a cassette tape mechanical button click sound
  const playClickSound = useCallback(async () => {
    if (!audioContextRef.current) return;
    
    try {
      const audioContext = audioContextRef.current;
      const now = audioContext.currentTime;
      
      // Resume audio context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Layer 1: Sharp mechanical click (the button mechanism engaging)
      const click = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      const clickFilter = audioContext.createBiquadFilter();
      
      click.type = 'sine';
      click.frequency.setValueAtTime(2000, now);
      click.frequency.exponentialRampToValueAtTime(1200, now + 0.008);
      
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(1800, now);
      clickFilter.Q.setValueAtTime(5, now);
      
      clickGain.gain.setValueAtTime(0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.012);
      
      click.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(audioContext.destination);
      
      click.start(now);
      click.stop(now + 0.012);
      
      // Layer 2: Low mechanical thunk (the button bottoming out)
      const thunk = audioContext.createOscillator();
      const thunkGain = audioContext.createGain();
      const thunkFilter = audioContext.createBiquadFilter();
      
      thunk.type = 'sine';
      thunk.frequency.setValueAtTime(200, now + 0.005);
      thunk.frequency.exponentialRampToValueAtTime(100, now + 0.025);
      
      thunkFilter.type = 'lowpass';
      thunkFilter.frequency.setValueAtTime(300, now);
      
      thunkGain.gain.setValueAtTime(0, now);
      thunkGain.gain.setValueAtTime(0.25, now + 0.005);
      thunkGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      
      thunk.connect(thunkFilter);
      thunkFilter.connect(thunkGain);
      thunkGain.connect(audioContext.destination);
      
      thunk.start(now);
      thunk.stop(now + 0.03);
      
      // Layer 3: Subtle spring release (the mechanism settling)
      const spring = audioContext.createOscillator();
      const springGain = audioContext.createGain();
      const springFilter = audioContext.createBiquadFilter();
      
      spring.type = 'sine';
      spring.frequency.setValueAtTime(800, now + 0.01);
      spring.frequency.exponentialRampToValueAtTime(400, now + 0.02);
      
      springFilter.type = 'bandpass';
      springFilter.frequency.setValueAtTime(600, now);
      springFilter.Q.setValueAtTime(3, now);
      
      springGain.gain.setValueAtTime(0, now);
      springGain.gain.setValueAtTime(0.1, now + 0.01);
      springGain.gain.exponentialRampToValueAtTime(0.01, now + 0.025);
      
      spring.connect(springFilter);
      springFilter.connect(springGain);
      springGain.connect(audioContext.destination);
      
      spring.start(now);
      spring.stop(now + 0.025);
      
    } catch (e) {
      console.warn('Failed to play click sound:', e);
    }
  }, []);

  // Play a lamp switch toggle sound (metal/plastic toggle switch)
  const playSwitchSound = useCallback(async () => {
    if (!audioContextRef.current) return;
    
    try {
      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Layer 1: Sharp metallic click
      const metalClick = audioContext.createOscillator();
      const metalGain = audioContext.createGain();
      const metalFilter = audioContext.createBiquadFilter();
      
      metalClick.type = 'triangle';
      metalClick.frequency.setValueAtTime(4000, audioContext.currentTime);
      metalClick.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.008);
      
      metalFilter.type = 'highpass';
      metalFilter.frequency.setValueAtTime(2000, audioContext.currentTime);
      
      metalGain.gain.setValueAtTime(0.25, audioContext.currentTime);
      metalGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.015);
      
      metalClick.connect(metalFilter);
      metalFilter.connect(metalGain);
      metalGain.connect(audioContext.destination);
      
      metalClick.start(audioContext.currentTime);
      metalClick.stop(audioContext.currentTime + 0.015);
      
      // Layer 2: Low "thunk" of the switch mechanism
      const thunk = audioContext.createOscillator();
      const thunkGain = audioContext.createGain();
      const thunkFilter = audioContext.createBiquadFilter();
      
      thunk.type = 'sine';
      thunk.frequency.setValueAtTime(300, audioContext.currentTime + 0.005);
      thunk.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.04);
      
      thunkFilter.type = 'lowpass';
      thunkFilter.frequency.setValueAtTime(500, audioContext.currentTime);
      
      thunkGain.gain.setValueAtTime(0, audioContext.currentTime);
      thunkGain.gain.setValueAtTime(0.2, audioContext.currentTime + 0.005);
      thunkGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      thunk.connect(thunkFilter);
      thunkFilter.connect(thunkGain);
      thunkGain.connect(audioContext.destination);
      
      thunk.start(audioContext.currentTime);
      thunk.stop(audioContext.currentTime + 0.05);
      
    } catch (e) {
      console.warn('Failed to play switch sound:', e);
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
    playSwitchSound();
    setState(prev => prev ? { ...prev, lampOn: !prev.lampOn } : null);
  }, [playSwitchSound]);

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
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
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
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`absolute ${debugMode ? 'debug-hitbox' : ''}`}
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

      {/* Custom circle cursor */}
      <div 
        className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
        }}
      />
    </div>
  );
}
