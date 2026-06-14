import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
  avatarUrl?: string;
}

interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth(user, accessToken, refreshToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sv-access-token', accessToken);
          localStorage.setItem('sv-refresh-token', refreshToken);
        }
        set({ user, accessToken, isAuthenticated: true });
      },

      clearAuth() {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sv-access-token');
          localStorage.removeItem('sv-refresh-token');
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      updateUser(data) {
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null }));
      },
    }),
    { name: 'sv-auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) },
  ),
);
