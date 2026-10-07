import { authApi } from '@/features/auth/api/auth-api';
import { queryClient } from '@/core/query/queryClient';
import { useEffect, type ReactNode } from 'react';
import { LoadingScreen } from '@/shared/components/ui';
import { useAuthStore } from './use-auth-store';
import { initializeAuth } from './auth-initializer';

export function AuthProvider({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    let pending = false;
    let active = true;
    let checkedAt = Date.now();
    const refreshPermissions = async () => {
      const before = useAuthStore.getState().session;
      if (!before || pending || Date.now() - checkedAt < 60_000) return;
      pending = true;
      checkedAt = Date.now();
      try {
        const fresh = await authApi.getMe();
        const current = useAuthStore.getState().session;
        if (!active || current?.id !== before.id || current.activeTenant?.id !== before.activeTenant?.id) return;
        if (JSON.stringify(current.activeTenant?.permissions) !== JSON.stringify(fresh.activeTenant?.permissions) ||
          current.activeTenant?.professionalId !== fresh.activeTenant?.professionalId) {
          await queryClient.cancelQueries({ predicate: (query) => query.queryKey[1] === before.activeTenant?.id });
          queryClient.removeQueries({ predicate: (query) => query.queryKey[1] === before.activeTenant?.id });
        }
        if (active && useAuthStore.getState().session?.id === before.id &&
          useAuthStore.getState().session?.activeTenant?.id === before.activeTenant?.id) useAuthStore.getState().setAuth(fresh);
      } catch {
        // A temporary connection failure must not erase a valid session.
      } finally { pending = false; }
    };
    const onFocus = () => { void refreshPermissions(); };
    window.addEventListener('focus', onFocus);
    const timer = window.setInterval(onFocus, 60_000);
    return () => { active = false; window.removeEventListener('focus', onFocus); window.clearInterval(timer); };
  }, []);

  if (!isInitialized) {
    return <LoadingScreen message="Cargando..." fullScreen />;
  }

  return <>{children}</>;
}
