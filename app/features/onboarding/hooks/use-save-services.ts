import { useMutation } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding.service';
import type { ServicesStepPayload } from '../schemas/services-step.schema';

export const useSaveServices = () => {
  return useMutation({
    mutationFn: (data: ServicesStepPayload) => onboardingService.updateServices(data),
  });
};
