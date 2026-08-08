import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ONBOARDING_STATUS_TO_ROUTE } from '@/shared/constants/onboarding';
import { getOnboardingStepIdFromPathname } from '@/shared/utils/onboarding-steps';
import { onboardingApi } from '../api/onboarding-api';
import { useOnboardingInitializer } from '../hooks/use-onboarding';
import { useAuthStore } from '@/core/auth/useAuthStore';
import type { OnboardingStatusResponse, OnboardingStepStatus, OnboardingSavedData } from '../schemas/onboarding-status.schema';

export const ONBOARDING_STATUS_QUERY_KEY = ['onboarding-status'] as const;

export interface OnboardingContextType {
  onboardingData: OnboardingStatusResponse | undefined;
  savedData: OnboardingSavedData | undefined;
  setOnboardingData: (data: OnboardingStatusResponse) => void;
  isLoading: boolean;
  isError: boolean;
  back: () => void;
  next: (action?: () => Promise<OnboardingStatusResponse>) => void;
  totalSteps: number;
  currentStep: string;
  setStep: (step: string) => void;
  steps: OnboardingStepStatus[];
}

const STATUS_TO_ROUTE = ONBOARDING_STATUS_TO_ROUTE;

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading, session } = useAuthStore();

  useOnboardingInitializer();

  const {
    data: onboardingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ONBOARDING_STATUS_QUERY_KEY,
    queryFn: () => onboardingApi.getStatus(),
    enabled: isAuthenticated && !isAuthLoading && !!session?.activeTenant,
  });

  const totalSteps = useMemo(() => onboardingData?.steps.length ?? 0, [onboardingData]);
  const currentStep = useMemo(() => getOnboardingStepIdFromPathname(window.location.pathname), [onboardingData]);

  const setOnboardingData = (data: OnboardingStatusResponse) => {
    queryClient.setQueryData(ONBOARDING_STATUS_QUERY_KEY, data);
  };

  useEffect(() => {
    if (!onboardingData) return;
    const route = STATUS_TO_ROUTE[onboardingData.onboardingStatus];
    if (route) {
      navigate(route);
    }
  }, [onboardingData, navigate]);

  const back = () => {
    const currentStepId = getOnboardingStepIdFromPathname(window.location.pathname);
    if (!currentStepId) return;

    const currentStepIndex = onboardingData?.steps.findIndex((step) => step.id === currentStepId);

    if (!currentStepIndex || currentStepIndex === -1) {
      throw new Error('Current step not found');
    }

    const previousStep = onboardingData?.steps[currentStepIndex - 1];

    if (previousStep && (previousStep.status === 'COMPLETED' || previousStep.status === 'CURRENT')) {
      navigate(STATUS_TO_ROUTE[previousStep.id]);
    }
  };

  const next = async (action?: () => Promise<OnboardingStatusResponse>) => {
    // 1. If we don't have initial data, we can't calculate routes
    if (!onboardingData) return;

    try {
      // 2. Execute the promise (Server Action / Mutation)
      const data = await action?.();

      // 3. Create the immediate truth source combining the old with the new
      const updatedOnboardingData = data ? { ...onboardingData, ...data } : onboardingData;

      if (data) {
        setOnboardingData(updatedOnboardingData);
      }

      // 4. Get the current step by URL
      const currentStepId = getOnboardingStepIdFromPathname(window.location.pathname);
      if (!currentStepId) return;

      // 5. Search in the updated data
      const currentStepIndex = updatedOnboardingData.steps.findIndex((step) => step.id === currentStepId);
      if (currentStepIndex === -1) return;

      const nextStep = updatedOnboardingData.steps[currentStepIndex + 1];

      // 6. Advance safely if the next step exists
      if (nextStep) {
        navigate(STATUS_TO_ROUTE[nextStep.id]);
      }
    } catch (error) {
      console.error('Error en la transición del onboarding:', error);
    }
  };

  const setStep = (step: string) => {
    if (!onboardingData) return;
    const currentStepIndex = onboardingData.steps.findIndex((s) => s.status === 'CURRENT');
    const stepIndex = onboardingData.steps.findIndex((s) => s.id === step);

    if (stepIndex === -1 || currentStepIndex === -1) return;

    if (currentStepIndex >= stepIndex) navigate(STATUS_TO_ROUTE[step]);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        savedData: onboardingData?.savedData,
        setOnboardingData,
        isLoading,
        isError,
        back,
        next,
        setStep,
        totalSteps,
        currentStep,
        steps: onboardingData?.steps ?? [],
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
