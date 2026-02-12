import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AUTHORIZED_USER = { username: 'Rachel Park', password: 'hello' };

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  canPost: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      username: null,

      login: (username: string, password: string) => {
        const normalizedUser = username.trim();
        const isAuthorized =
          normalizedUser === AUTHORIZED_USER.username &&
          password === AUTHORIZED_USER.password;
        if (isAuthorized) {
          set({ isLoggedIn: true, username: normalizedUser });
          return true;
        }
        return false;
      },

      logout: () => set({ isLoggedIn: false, username: null }),

      canPost: () => get().isLoggedIn && get().username === AUTHORIZED_USER.username,
    }),
    { name: 'work-ledger-auth' }
  )
);
