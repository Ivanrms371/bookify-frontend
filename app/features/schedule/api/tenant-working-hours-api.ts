import { httpClient } from '@/core/http/httpClient';
import type { BusinessHour, TenantWorkingHoursSaveInput } from '../types/tenant-working-hours.types';
export const tenantWorkingHoursApi = {
  get: (tenantId: string, signal?: AbortSignal) =>
    httpClient.get<BusinessHour[]>('/settings/working-hours', { expectedTenantId: tenantId, signal }),
  save: (tenantId: string, data: TenantWorkingHoursSaveInput) =>
    httpClient.put<{ success: boolean }>('/settings/working-hours', data, { expectedTenantId: tenantId, skipAuthRetry: true }),
};
