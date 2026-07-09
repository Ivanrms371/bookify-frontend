import { httpClient } from '@/core/http/httpClient';
import type { WorkingHoursDTO } from '../utils/map-schedule-to-dto';

export const workingHoursService = {
  createWorkingHours: (tenantId: string, workingHours: WorkingHoursDTO[]) => {
    return httpClient.post(`/tenants/${tenantId}/working-hours`, { workingHours });
  },
};
