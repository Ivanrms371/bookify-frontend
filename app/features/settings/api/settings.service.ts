import { httpClient } from '@/core/http/httpClient';
import type { TenantSettingsResponse, UpdateGeneralSettingsPayload, UpdateAppointmentSettingsPayload } from '../types/settings.types';

export const SettingsService = {
  getSettings: async (): Promise<TenantSettingsResponse> => httpClient.get<TenantSettingsResponse>('/settings'),
  updateGeneralSettings: async (data: UpdateGeneralSettingsPayload): Promise<void> => httpClient.patch('/settings/general', data),
  updateAppointmentSettings: async (data: UpdateAppointmentSettingsPayload): Promise<void> =>
    httpClient.patch('/settings/appointments', data),
};
