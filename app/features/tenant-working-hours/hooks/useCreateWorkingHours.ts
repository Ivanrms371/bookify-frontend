import { useMutation } from '@tanstack/react-query';
import type { TenantWorkingHoursCreateInput } from '../types/tenant-working-hours.types';
import { workingHoursService } from '../services/working-hours.service';

export const useCreateWorkingHours = (tenantId: string) => {
  return useMutation({
    mutationFn: (data: TenantWorkingHoursCreateInput[]) => workingHoursService.createWorkingHours(tenantId ?? '', data),
  });
};
