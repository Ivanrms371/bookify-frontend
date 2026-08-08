import { useCallback, useEffect, type ReactNode } from 'react';
import { useAuthStore } from './useAuthStore';
import { useLoadingScreen } from '@/shared/store/use-loading-screen';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { refetch } = useAuthStore();
  const { show, hide } = useLoadingScreen();

  useEffect(() => {
    try {
      show('Cargando...');
      refetch();
    } catch (error) {
    } finally {
      hide();
    }
  }, [hide]);

  return <>{children}</>;
}
