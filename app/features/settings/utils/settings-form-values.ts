import type { TenantSettingsResponse } from '../types/settings.types';
import type { TenantGeneralSettingsFormValues, AppointmentSettingsFormValues } from '../schemas/tenant-settings-schema';

export function generalSettingsValues(data: TenantSettingsResponse): TenantGeneralSettingsFormValues {
  return {
    name: data.name ?? '',
    slug: data.slug ?? '',
    timeZone: data.settings?.timeZone ?? 'America/Montevideo',
    phoneNumber: data.phoneNumber ?? '',
    addressLine1: data.addressLine1 ?? '',
    addressLine2: data.addressLine2 ?? '',
    city: data.city ?? '',
    province: data.province ?? '',
    country: data.country ?? '',
    logoFile: undefined,
    coverFile: undefined,
  };
}

export function appointmentSettingsValues(settings: NonNullable<TenantSettingsResponse['settings']>): AppointmentSettingsFormValues {
  return {
    slotIntervalMinutes: settings.slotIntervalMinutes,
    maxAdvancedDays: settings.maxAdvancedDays,
    minAdvancedMinutes: settings.minAdvancedMinutes,
    cancellationWindowMinutes: settings.cancellationWindowMinutes,
    maxPendingApptsPerClient: settings.maxPendingApptsPerClient,
    requireConfirmation: settings.requireConfirmation,
    holidayClosureAutoApply: settings.holidayClosureAutoApply,
    allowPassiveTimeBooking: settings.allowPassiveTimeBooking,
  };
}
