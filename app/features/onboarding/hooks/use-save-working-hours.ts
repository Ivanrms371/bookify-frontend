import type { TenantWorkingHoursSaveInput } from '@/features/tenant-working-hours/types/tenant-working-hours.types';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { onboardingService } from '../services/onboarding.service';

export const useSaveWorkingHours = () => {
  return useMutation({
    mutationFn: (data: TenantWorkingHoursSaveInput) => onboardingService.updateSchedule(data),
  });
};
