import { useContext, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/useAuthStore';
import { authApi } from '@/features/auth/api/auth-api';
import { OnboardingContext, ONBOARDING_STATUS_QUERY_KEY } from '../context/onboarding-context';
import { onboardingApi } from '../api/onboarding-api';
import { useLoadingScreen } from '@/shared/store/use-loading-screen';

/** Crea el tenant inicial cuando el usuario está autenticado pero aún no tiene onboarding. */
export const useOnboardingInitializer = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading, session, setAuth } = useAuthStore();
  const { show, hide } = useLoadingScreen();
  const initStarted = useRef(false);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
    if (session?.activeTenant?.onboardingStatus) return;
    if (initStarted.current) return;

    initStarted.current = true;

    const initialize = async () => {
      try {
        show('Preparando tu experiencia...');
        await onboardingApi.init();
        const session = await authApi.getMe();
        setAuth(session);

        const status = await onboardingApi.getStatus();
        queryClient.setQueryData(ONBOARDING_STATUS_QUERY_KEY, status);
      } catch (error) {
        initStarted.current = false;
        console.error('Error al inicializar onboarding:', error);
      } finally {
        hide();
      }
    };

    initialize();
  }, [isAuthLoading, isAuthenticated, session?.activeTenant?.onboardingStatus, setAuth, queryClient]);
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
