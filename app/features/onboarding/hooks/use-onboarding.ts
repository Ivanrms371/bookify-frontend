import { authApi } from '@/features/auth/api/auth-api';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { OnboardingContext, ONBOARDING_STATUS_QUERY_KEY } from '../context/onboarding-context';
import { onboardingApi } from '../api/onboarding-api';

/**
 * Fuente única de verdad para el onboarding.
 * - Si el tenant activo aún no tiene onboarding, inicializa uno con POST /onboarding/init.
 * - Si ya existe, lee el estado con GET /onboarding/status.
 * Devuelve `{ data, isLoading, isError }` para que el contexto lo consuma directamente.
 */
export const useOnboardingInitializer = () => {
  const { isAuthenticated, isLoading: isAuthLoading, session } = useAuthStore();

  const hasOnboarding = !!session?.activeTenant?.onboardingStatus;

  return useQuery({
    queryKey: [...ONBOARDING_STATUS_QUERY_KEY, session?.id],
    queryFn: async () => {
      const data = await (hasOnboarding ? onboardingApi.getStatus() : onboardingApi.init());
      if (useAuthStore.getState().session?.activeTenant?.id !== data.tenantId) {
        const refreshed = await authApi.getMe();
        if (refreshed.activeTenant?.id !== data.tenantId) throw new Error('No se pudo sincronizar el negocio');
        useAuthStore.getState().setAuth(refreshed);
      }
      return data;
    },
    enabled: isAuthenticated && !isAuthLoading,
    retry: false,
    staleTime: Infinity,
  });
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
