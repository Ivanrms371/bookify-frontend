import type { TenantWorkingHoursSaveInput } from '@/features/tenant-working-hours/types/tenant-working-hours.types';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { onboardingApi } from '../api/onboarding-api';

export const useSaveWorkingHours = () => {
  return useMutation({
    mutationFn: (data: TenantWorkingHoursSaveInput) => onboardingApi.updateSchedule(data),
  });
};
