import { httpClient } from '@/core/http/httpClient';
import type { ScheduleExceptionFormData } from '../schemas/schedule-exception-form-schema';
import type { ScheduleException } from '../types/schedule-exception.types';
export const scheduleExceptionApi = {
  getAll: (tenantId: string, signal?: AbortSignal) =>
    httpClient.get<ScheduleException[]>('/settings/exceptions', { expectedTenantId: tenantId, signal }),
  getById: (id: string, tenantId: string) =>
    httpClient.get<ScheduleException>(`/settings/exceptions/${id}`, { expectedTenantId: tenantId }),
  create: (data: ScheduleExceptionFormData, tenantId: string) =>
    httpClient.post<ScheduleException>('/settings/exceptions', data, { expectedTenantId: tenantId, skipAuthRetry: true }),
  update: (id: string, data: ScheduleExceptionFormData, tenantId: string) =>
    httpClient.put<ScheduleException>(`/settings/exceptions/${id}`, data, { expectedTenantId: tenantId, skipAuthRetry: true }),
  delete: (id: string, tenantId: string) =>
    httpClient.delete(`/settings/exceptions/${id}`, { expectedTenantId: tenantId, skipAuthRetry: true }),
};
