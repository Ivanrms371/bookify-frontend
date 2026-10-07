import { httpClient } from '@/core/http/httpClient';
import type {
  TenantSettingsResponse,
  UpdateGeneralSettingsPayload,
  UpdateAppointmentSettingsPayload,
  UpdateGeneralSettingsResponse,
} from '../types/settings.types';

export const SettingsService = {
  getSettings: (tenantId: string, signal?: AbortSignal): Promise<TenantSettingsResponse> =>
    httpClient.get<TenantSettingsResponse>('/settings', { expectedTenantId: tenantId, signal }),
  updateGeneralSettings: (data: UpdateGeneralSettingsPayload, tenantId: string): Promise<UpdateGeneralSettingsResponse> =>
    httpClient.patch('/settings/general', data, { expectedTenantId: tenantId, skipAuthRetry: true }),
  updateAppointmentSettings: (data: UpdateAppointmentSettingsPayload, tenantId: string): Promise<void> =>
    httpClient.patch('/settings/appointments', data, { expectedTenantId: tenantId, skipAuthRetry: true }),
};
