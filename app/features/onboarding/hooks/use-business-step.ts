import { useMutation } from '@tanstack/react-query';
import type { BusinessStepPayload } from '../schemas/business-step.schema';
import { onboardingService } from '../services/onboarding.service';

export const useBusinessStep = () => {
  return useMutation({
    mutationFn: (data: BusinessStepPayload) => onboardingService.updateBusiness(data),
  });
};
