// core/auth/useAuthStore.ts
import { authService } from '@/features/auth/services/auth.service';
import type { AuthUser, TenantSummary } from '@/features/auth/types/auth.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthRefetchResult = { user: AuthUser; tenant: TenantSummary | null };

interface AuthState {
  user: AuthUser | null;
  tenant: TenantSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefetching: boolean;

  setLoading: (loading: boolean) => void;
  setAuth: (user: AuthUser, tenant: TenantSummary | null) => void;
  clearAuth: () => void;
  refetch: () => Promise<AuthRefetchResult | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: true,
      isRefetching: false,

      setLoading: (loading) => set({ isLoading: loading }),
      setAuth: (user, tenant) => set({ user, tenant, isAuthenticated: true }),

      clearAuth: () => set({ user: null, tenant: null, isAuthenticated: false }),

      refetch: async () => {
        set({ isLoading: true, isRefetching: true });

        try {
          const { user, tenant } = await authService.getMe();
          set({ user, tenant, isAuthenticated: true });
          return { user, tenant };
        } catch {
          console.log('clear');
          set({ user: null, tenant: null, isAuthenticated: false });
          return null;
        } finally {
          set({ isLoading: false, isRefetching: false });
        }
      },
    }),
    { name: 'auth-storage' },
  ),
);
