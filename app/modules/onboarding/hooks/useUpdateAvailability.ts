import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding.api';
import type { UpdateAvailabilityInput } from '../types/onboarding.types';

export const useUpdateAvailability = (businessId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAvailabilityInput) => {
      if (!businessId) throw new Error('Business ID is required');
      return onboardingApi.updateAvailability(businessId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-checklist', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business'] });
    },
  });
};
