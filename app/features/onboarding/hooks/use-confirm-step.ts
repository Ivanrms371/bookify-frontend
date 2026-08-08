import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';

export const useConfirmStep = () => {
  return useMutation({
    mutationFn: () => onboardingApi.confirm(),
  });
};
