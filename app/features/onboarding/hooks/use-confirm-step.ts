import { useMutation } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding.service';

export const useConfirmStep = () => {
  return useMutation({
    mutationFn: () => onboardingService.confirm(),
  });
};
