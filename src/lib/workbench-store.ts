// Simple store for workbench state (positions, notes)
// Persists to localStorage

export interface PostItNote {
  id: string;
  content: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
  position: { x: number; y: number };
  rotation: number;
  zIndex: number;
}

export interface WorkbenchState {
  notes: PostItNote[];
  lampOn: boolean;
}

const STORAGE_KEY = 'workbench-state';

const defaultNotes: PostItNote[] = [
  {
    id: 'note-1',
    content: 'Week 04 goals:\n• Finish node graph\n• Review PRs\n• Update docs',
    color: 'yellow',
    position: { x: 120, y: 150 },
    rotation: -3,
    zIndex: 1,
  },
  {
    id: 'note-2', 
    content: 'URGENT:\nCall back client\nabout project timeline',
    color: 'pink',
    position: { x: 280, y: 180 },
    rotation: 4,
    zIndex: 2,
  },
  {
    id: 'note-3',
    content: 'Ideas:\n• Dark mode\n• Mobile view\n• Export feature',
    color: 'blue',
    position: { x: 500, y: 220 },
    rotation: -2,
    zIndex: 3,
  },
  {
    id: 'note-4',
    content: 'Meeting notes\n9am standup\n2pm design review',
    color: 'green',
    position: { x: 380, y: 500 },
    rotation: 6,
    zIndex: 4,
  },
];

export function loadWorkbenchState(): WorkbenchState {
  if (typeof window === 'undefined') {
    return { notes: defaultNotes, lampOn: true };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load workbench state:', e);
  }
  
  return { notes: defaultNotes, lampOn: true };
}

export function saveWorkbenchState(state: WorkbenchState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save workbench state:', e);
  }
}

export function generateNoteId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
