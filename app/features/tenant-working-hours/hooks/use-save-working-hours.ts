import { useMutation } from '@tanstack/react-query';
import { workingHoursService } from '../services/working-hours.service';
import type { WorkingHoursDTO } from '../utils/map-schedule-to-dto';
import type { TenantWorkingHoursSaveInput } from '../types/tenant-working-hours.types';

export const useSaveWorkingHours = () => {
  return useMutation({
    mutationFn: (data: TenantWorkingHoursSaveInput[]) => workingHoursService.createWorkingHours('', data),
  });
};
