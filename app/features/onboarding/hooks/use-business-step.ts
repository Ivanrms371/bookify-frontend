import { useMutation } from '@tanstack/react-query';
import type { BusinessStepPayload } from '../schemas/business-step.schema';
import { onboardingApi } from '../api/onboarding-api';

export const useBusinessStep = () => {
  return useMutation({
    mutationFn: (data: BusinessStepPayload) => onboardingApi.updateBusiness(data),
  });
};
