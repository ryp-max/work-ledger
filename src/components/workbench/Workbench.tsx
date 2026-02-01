'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostItNote } from './PostItNote';
import { DeskLamp } from './DeskLamp';
import { ToolRack } from './ToolRack';
import { AddNoteButton } from './AddNoteButton';
import { PegboardFrame } from './PegboardFrame';
import { 
  loadWorkbenchState, 
  saveWorkbenchState, 
  generateNoteId,
  type PostItNote as PostItNoteType,
  type WorkbenchState 
} from '@/lib/workbench-store';

interface WorkbenchProps {
  children?: React.ReactNode;
}

export function Workbench({ children }: WorkbenchProps) {
  const [state, setState] = useState<WorkbenchState>({ notes: [], lampOn: true });
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Load state on mount
  useEffect(() => {
    const loaded = loadWorkbenchState();
    setState(loaded);
    const maxZ = Math.max(...loaded.notes.map(n => n.zIndex), 10);
    setMaxZIndex(maxZ);
    setWindowWidth(window.innerWidth);
    setMounted(true);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save state on change
  useEffect(() => {
    if (mounted) {
      saveWorkbenchState(state);
    }
  }, [state, mounted]);

  const updateNote = useCallback((id: string, updates: Partial<PostItNoteType>) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      ),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id),
    }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setMaxZIndex(prev => {
      const newZ = prev + 1;
      setState(prevState => ({
        ...prevState,
        notes: prevState.notes.map(note =>
          note.id === id ? { ...note, zIndex: newZ } : note
        ),
      }));
      return newZ;
    });
  }, []);

  const addNote = useCallback(() => {
    const colors: PostItNoteType['color'][] = ['yellow', 'pink', 'blue', 'green', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotation = Math.floor(Math.random() * 7) - 3;
    
    const newNote: PostItNoteType = {
      id: generateNoteId(),
      content: '',
      color: randomColor,
      position: { 
        x: 200 + Math.random() * 400, 
        y: 100 + Math.random() * 200 
      },
      rotation: randomRotation,
      zIndex: maxZIndex + 1,
    };
    
    setMaxZIndex(prev => prev + 1);
    setState(prev => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
  }, [maxZIndex]);

  const toggleLamp = useCallback(() => {
    setState(prev => ({ ...prev, lampOn: !prev.lampOn }));
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[var(--wood-dark)] flex items-center justify-center">
        <div className="text-amber-200 font-serif text-xl">Loading workbench...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Pegboard wall */}
      <div className="absolute inset-0 pegboard" style={{ height: '60%' }}>
        {/* Tool rack */}
        <ToolRack />

        {/* Decorative frames */}
        <PegboardFrame title="Certificate" position={{ x: 300, y: 20 }}>
          <div className="w-36 h-28 bg-gradient-to-br from-green-100 to-green-50 border border-green-300 p-2">
            <div className="text-[8px] text-green-800 text-center font-serif">
              <div className="text-xs font-bold mb-1">WORK LEDGER</div>
              <div>Certificate of</div>
              <div className="font-bold">Excellence</div>
              <div className="mt-2 text-green-600">★ ★ ★</div>
            </div>
          </div>
        </PegboardFrame>

        <PegboardFrame title="Award" position={{ x: 480, y: 30 }}>
          <div className="w-28 h-20 bg-gradient-to-br from-amber-800 to-amber-900 p-2 flex items-center justify-center">
            <div className="text-[8px] text-amber-200 text-center">
              <div className="text-xs">🏆</div>
              <div>Best Work</div>
              <div>2026</div>
            </div>
          </div>
        </PegboardFrame>

        {/* Post-it notes */}
        {state.notes.map(note => (
          <PostItNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onBringToFront={bringToFront}
          />
        ))}
      </div>

      {/* Wooden desk surface */}
      <div 
        className="absolute bottom-0 left-0 right-0 wood-texture"
        style={{ height: '40%' }}
      >
        {/* Desk edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-900/50 to-transparent" />
        
        {/* Main content area (ledger) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
          {children}
        </div>
      </div>

      {/* Desk lamps */}
      <DeskLamp
        initialPosition={{ x: 50, y: 280 }}
        isOn={state.lampOn}
        onToggle={toggleLamp}
        side="left"
      />
      <DeskLamp
        initialPosition={{ x: windowWidth - 130, y: 280 }}
        isOn={state.lampOn}
        onToggle={toggleLamp}
        side="right"
      />

      {/* Add note button */}
      <AddNoteButton onAdd={addNote} />

      {/* Instructions tooltip */}
      <div className="fixed bottom-6 left-6 text-xs text-amber-200/60 bg-black/30 px-3 py-2 rounded">
        <p>💡 Click lamps to toggle • Drag notes around • Double-click to edit</p>
      </div>
    </div>
  );
}
