import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding.api';
import type { AddBusinessAddressInput } from '../types/onboarding.types';

export const useAddBusinessAddress = (businessId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddBusinessAddressInput) => {
      if (!businessId) throw new Error('Business ID is required');
      return onboardingApi.addBusinessAddress(businessId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-checklist', businessId] });
      // Depending on global state, we might also invalidate 'current-business'
      queryClient.invalidateQueries({ queryKey: ['business'] });
    },
  });
};
