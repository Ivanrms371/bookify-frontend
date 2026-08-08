import { useMutation } from '@tanstack/react-query';
import type { TenantWorkingHoursCreateInput } from '../types/tenant-working-hours.types';
import { workingHoursService } from '../api/working-hours-api';

export const useCreateWorkingHours = (tenantId: string) => {
  return useMutation({
    mutationFn: (data: TenantWorkingHoursCreateInput[]) => workingHoursService.createWorkingHours(tenantId ?? '', data),
  });
};
