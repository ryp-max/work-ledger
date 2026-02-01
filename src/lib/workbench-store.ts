// Persistence for the photo-based UI

export interface LedgerEntry {
  id: string;
  date: string;
  leftPage: string;
  rightPage: string;
}

export interface WorkbenchState {
  stickyNote: string;
  ledgerEntries: LedgerEntry[];
  currentMonth: number; // 0-11
  lampOn: boolean;
  isPlaying: boolean;
}

const STORAGE_KEY = 'work-ledger-state';

const defaultState: WorkbenchState = {
  stickyNote: '',
  ledgerEntries: [
    {
      id: 'jan-week-1',
      date: 'January Week 1',
      leftPage: '',
      rightPage: '',
    }
  ],
  currentMonth: 0,
  lampOn: true,
  isPlaying: false,
};

export function loadState(): WorkbenchState {
  if (typeof window === 'undefined') {
    return defaultState;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  
  return defaultState;
}

export function saveState(state: WorkbenchState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function getCurrentEntry(state: WorkbenchState): LedgerEntry {
  return state.ledgerEntries[0] || defaultState.ledgerEntries[0];
}
