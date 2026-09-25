import { useEffect, type ReactNode } from 'react';
import { LoadingScreen } from '@/shared/components/ui';
import { useAuthStore } from './use-auth-store';
import { initializeAuth } from './auth-initializer';

export function AuthProvider({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!isInitialized) {
    return <LoadingScreen message="Cargando..." fullScreen />;
  }

  return <>{children}</>;
}
