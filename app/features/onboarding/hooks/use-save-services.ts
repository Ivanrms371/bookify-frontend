import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';
import type { ServicesStepPayload } from '../schemas/services-step.schema';

export const useSaveServices = () => {
  return useMutation({
    mutationFn: (data: ServicesStepPayload) => onboardingApi.updateServices(data),
  });
};
