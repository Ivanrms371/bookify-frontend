import type { SaveWorkingHours } from '@/features/schedule/schemas/schedule-form-schema';
import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';

export const useSaveWorkingHours = () => {
  return useMutation({
    mutationFn: (data: SaveWorkingHours) => onboardingApi.updateSchedule(data),
  });
};
