// core/auth/useAuthStore.ts
import { authApi } from '@/features/auth/api/auth-api';
import type { UserSessionContext } from '@/features/auth/types/auth.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  session: UserSessionContext | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefetching: boolean;

  setLoading: (loading: boolean) => void;
  setAuth: (session: UserSessionContext) => void;
  clearAuth: () => void;
  refetch: () => Promise<UserSessionContext | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      isLoading: true,
      isRefetching: false,

      setLoading: (loading) => set({ isLoading: loading }),
      setAuth: (session) => set({ session, isAuthenticated: true }),

      clearAuth: () => set({ session: null, isAuthenticated: false }),

      refetch: async () => {
        set({ isLoading: true, isRefetching: true });

        try {
          const session = await authApi.getMe();
          set({ session, isAuthenticated: true });
          return session;
        } catch {
          set({ session: null, isAuthenticated: false });
          return null;
        } finally {
          set({ isLoading: false, isRefetching: false });
        }
      },
    }),
    { name: 'auth-storage' },
  ),
);
