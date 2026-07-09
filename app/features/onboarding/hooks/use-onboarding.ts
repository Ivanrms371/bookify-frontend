import { useContext, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/useAuthStore';
import { authService } from '@/features/auth/services/auth.service';
import { OnboardingContext, ONBOARDING_STATUS_QUERY_KEY } from '../context/onboarding-context';
import { onboardingService } from '../services/onboarding.service';
import { useLoadingScreen } from '@/shared/store/use-loading-screen';

/** Crea el tenant inicial cuando el usuario está autenticado pero aún no tiene onboarding. */
export const useOnboardingInitializer = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading, tenant, user, setAuth } = useAuthStore();
  const { show, hide } = useLoadingScreen();
  const initStarted = useRef(false);

  useEffect(() => {
    console.log(isAuthLoading);
    if (isAuthLoading || !isAuthenticated) return;
    if (tenant?.onboardingStatus) return;
    if (initStarted.current) return;

    initStarted.current = true;

    const initialize = async () => {
      console.log('Inicialiazndo');
      try {
        show('Preparando tu experiencia...');
        await onboardingService.init();
        const me = await authService.getMe();
        setAuth(me.user, me.tenant);

        const status = await onboardingService.getStatus();
        queryClient.setQueryData(ONBOARDING_STATUS_QUERY_KEY, status);
      } catch (error) {
        initStarted.current = false;
        console.error('Error al inicializar onboarding:', error);
      } finally {
        hide();
      }
    };

    initialize();
  }, [isAuthLoading, isAuthenticated, tenant?.onboardingStatus, user, setAuth, queryClient]);
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
