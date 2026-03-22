import { useQuery } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding.api';

export const useGetChecklist = (businessId: string | undefined) => {
  return useQuery({
    queryKey: ['onboarding-checklist', businessId],
    queryFn: () => onboardingApi.getChecklist(businessId!),
    enabled: !!businessId,
  });
};
