import { useMutation } from '@tanstack/react-query';
import type { CustomizeStepPayload } from '../schemas/customize-step.schema';
import { onboardingApi } from '../api/onboarding-api';

export const useSaveCustomize = () => {
  return useMutation({
    mutationFn: (data: CustomizeStepPayload) => onboardingApi.updateCustomize(data),
  });
};
