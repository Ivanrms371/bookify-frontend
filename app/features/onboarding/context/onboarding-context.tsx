import { useAuthStore } from '@/core/auth/use-auth-store';
import { createContext, useMemo, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ONBOARDING_STATUS_TO_ROUTE } from '@/shared/constants/onboarding';
import { getOnboardingStepIdFromPathname } from '@/shared/utils/onboarding-steps';
import { useOnboardingInitializer } from '../hooks/use-onboarding';
import type { OnboardingStatusResponse, OnboardingStepStatus, OnboardingSavedData } from '../schemas/onboarding-status.schema';

export const ONBOARDING_STATUS_QUERY_KEY = ['onboarding-status'] as const;

export interface OnboardingContextType {
  onboardingData: OnboardingStatusResponse | undefined;
  savedData: OnboardingSavedData | undefined;
  setOnboardingData: (data: OnboardingStatusResponse) => void;
  isLoading: boolean;
  isError: boolean;
  back: () => void;
  next: (action?: () => Promise<OnboardingStatusResponse>) => Promise<void>;
  totalSteps: number;
  currentStep: string;
  setStep: (step: string) => void;
  steps: OnboardingStepStatus[];
}

const STATUS_TO_ROUTE = ONBOARDING_STATUS_TO_ROUTE;

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const { data: onboardingData, isLoading, isError } = useOnboardingInitializer();

  const totalSteps = useMemo(() => onboardingData?.steps?.length ?? 0, [onboardingData]);
  const currentStep = useMemo(() => getOnboardingStepIdFromPathname(pathname), [pathname]);

  const setOnboardingData = (data: OnboardingStatusResponse) => {
    queryClient.setQueryData([...ONBOARDING_STATUS_QUERY_KEY, useAuthStore.getState().session?.id], data);
  };

  const back = () => {
    const currentStepId = getOnboardingStepIdFromPathname(pathname);
    if (!currentStepId) return;

    const currentStepIndex = onboardingData?.steps.findIndex((step) => step.id === currentStepId);

    if (currentStepIndex === undefined || currentStepIndex <= 0) return;

    const previousStep = onboardingData?.steps[currentStepIndex - 1];

    if (previousStep && (previousStep.status === 'COMPLETED' || previousStep.status === 'CURRENT')) {
      navigate(STATUS_TO_ROUTE[previousStep.id]);
    }
  };

  const next = async (action?: () => Promise<OnboardingStatusResponse>) => {
    // 1. If we don't have initial data, we can't calculate routes
    if (!onboardingData) return;

    const data = await action?.();
    const updated = data ?? onboardingData;
    if (data) setOnboardingData(data);
    if (updated.onboardingStatus === 'COMPLETED') {
      navigate(STATUS_TO_ROUTE.COMPLETED, { replace: true });
      return;
    }
    const index = updated.steps.findIndex((step) => step.id === getOnboardingStepIdFromPathname(pathname));
    const nextStep = updated.steps[index + 1];
    if (index >= 0 && nextStep && nextStep.status !== 'PENDING') navigate(STATUS_TO_ROUTE[nextStep.id]);
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
