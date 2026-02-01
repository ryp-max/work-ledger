'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostItNote } from './PostItNote';
import { DraggableTool } from './DraggableTool';
import { AddNoteButton } from './AddNoteButton';
import { 
  Lamp, 
  Pliers, 
  Screwdriver, 
  XActo, 
  Ruler, 
  PencilCup, 
  SmallParts,
  ControlBox 
} from './tools';
import { 
  loadWorkbenchState, 
  saveWorkbenchState, 
  generateNoteId,
  type PostItNote as PostItNoteType,
  type WorkbenchState 
} from '@/lib/workbench-store';

export function Workbench() {
  const [state, setState] = useState<WorkbenchState>({ notes: [], lampOn: true });
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [mounted, setMounted] = useState(false);

  // Load state on mount
  useEffect(() => {
    const loaded = loadWorkbenchState();
    setState(loaded);
    const maxZ = Math.max(...loaded.notes.map(n => n.zIndex), 10);
    setMaxZIndex(maxZ);
    setMounted(true);
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
    const randomRotation = Math.floor(Math.random() * 10) - 5;
    
    const newNote: PostItNoteType = {
      id: generateNoteId(),
      content: '',
      color: randomColor,
      position: { 
        x: 300 + Math.random() * 400, 
        y: 200 + Math.random() * 300 
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
      <div className="w-full h-screen bg-[#8b6914] flex items-center justify-center">
        <div className="text-amber-100 text-xl">Loading workbench...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden wood-surface">
      {/* Wood stain marks for realism */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="wood-stain absolute w-96 h-96 top-20 left-40" />
        <div className="wood-stain absolute w-64 h-64 bottom-40 right-60" />
        <div className="wood-stain absolute w-48 h-48 top-1/2 left-1/4" />
      </div>

      {/* Scratches/wear marks */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(73deg, transparent 30%, rgba(255,255,255,0.05) 30.5%, transparent 31%),
            linear-gradient(107deg, transparent 60%, rgba(0,0,0,0.03) 60.5%, transparent 61%)
          `,
        }}
      />

      {/* === TOOLS === */}
      
      {/* Control Box (top left) */}
      <DraggableTool id="control-box" initialPosition={{ x: 30, y: 30 }} zIndex={5}>
        <ControlBox />
      </DraggableTool>

      {/* Main Lamp (center top) */}
      <DraggableTool id="lamp" initialPosition={{ x: 450, y: 80 }} zIndex={15}>
        <Lamp isOn={state.lampOn} onToggle={toggleLamp} />
      </DraggableTool>

      {/* Pencil Cup (top right area) */}
      <DraggableTool id="pencil-cup" initialPosition={{ x: 750, y: 50 }} zIndex={8}>
        <PencilCup />
      </DraggableTool>

      {/* Ruler (angled on desk) */}
      <DraggableTool id="ruler" initialPosition={{ x: 550, y: 400 }} initialRotation={-15} zIndex={6}>
        <Ruler />
      </DraggableTool>

      {/* Pliers */}
      <DraggableTool id="pliers" initialPosition={{ x: 100, y: 250 }} initialRotation={25} zIndex={7}>
        <Pliers />
      </DraggableTool>

      {/* Screwdriver */}
      <DraggableTool id="screwdriver" initialPosition={{ x: 650, y: 280 }} initialRotation={-30} zIndex={6}>
        <Screwdriver />
      </DraggableTool>

      {/* X-Acto knife */}
      <DraggableTool id="xacto" initialPosition={{ x: 350, y: 350 }} initialRotation={45} zIndex={6}>
        <XActo />
      </DraggableTool>

      {/* Small parts dish */}
      <DraggableTool id="small-parts" initialPosition={{ x: 800, y: 200 }} zIndex={5}>
        <SmallParts />
      </DraggableTool>

      {/* Extra screwdriver */}
      <DraggableTool id="screwdriver-2" initialPosition={{ x: 180, y: 450 }} initialRotation={-10} zIndex={6}>
        <Screwdriver />
      </DraggableTool>

      {/* Extra pliers */}
      <DraggableTool id="pliers-2" initialPosition={{ x: 700, y: 500 }} initialRotation={-45} zIndex={7}>
        <Pliers />
      </DraggableTool>

      {/* === POST-IT NOTES === */}
      {state.notes.map(note => (
        <PostItNote
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onBringToFront={bringToFront}
        />
      ))}

      {/* Add note button */}
      <AddNoteButton onAdd={addNote} />

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 text-xs text-white/50 bg-black/40 px-3 py-2 rounded backdrop-blur-sm">
        <p>🔧 Drag tools & notes • 💡 Click lamp to toggle • ✏️ Double-click notes to edit</p>
      </div>
    </div>
  );
}
