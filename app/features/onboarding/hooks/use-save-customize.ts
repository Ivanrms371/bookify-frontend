import { useMutation } from '@tanstack/react-query';
import type { CustomizeStepPayload } from '../schemas/customize-step.schema';
import { onboardingService } from '../services/onboarding.service';

export const useSaveCustomize = () => {
  return useMutation({
    mutationFn: (data: CustomizeStepPayload) => onboardingService.updateCustomize(data),
  });
};
