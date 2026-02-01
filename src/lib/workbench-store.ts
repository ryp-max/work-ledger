// Simple store for workbench state (positions, notes)
// In production, this would persist to localStorage or a database

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
    content: 'Week 04 goals:\n- Finish node graph\n- Review PRs',
    color: 'yellow',
    position: { x: 150, y: 100 },
    rotation: -2,
    zIndex: 1,
  },
  {
    id: 'note-2', 
    content: 'Remember to update the changelog!',
    color: 'pink',
    position: { x: 320, y: 150 },
    rotation: 3,
    zIndex: 2,
  },
  {
    id: 'note-3',
    content: 'Ideas:\n• Better search\n• Dark mode\n• Mobile view',
    color: 'blue',
    position: { x: 500, y: 80 },
    rotation: -1,
    zIndex: 3,
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
