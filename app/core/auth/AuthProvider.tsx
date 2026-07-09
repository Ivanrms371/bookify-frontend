import { useCallback, useEffect, type ReactNode } from 'react';
import { useAuthStore } from './useAuthStore';
import { useLoadingScreen } from '@/shared/store/use-loading-screen';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { refetch } = useAuthStore();
  const { show, hide } = useLoadingScreen();

  useEffect(() => {
    try {
      show('Cargando...');
      console.log('Cargando');
      refetch();
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    } finally {
      hide();
    }
  }, [hide]);

  return <>{children}</>;
}
