import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';
import type { ProfessionalStepPayload } from '../schemas/professional-step.schema';
export const useSaveProfessional = () =>
  useMutation({
    mutationFn: (data: ProfessionalStepPayload) => onboardingApi.updateProfessional(data),
  });
