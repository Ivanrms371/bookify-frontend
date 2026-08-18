export interface TenantSettingsResponse {
  name: string | null;
  slug: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  coverUrl: string | null;
  coverPublicId: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  settings: {
    slotIntervalMinutes: number;
    maxAdvancedDays: number;
    minAdvancedMinutes: number;
    bufferTimeMinutes: number;
    cancellationWindowMinutes: number;
    currency: string;
    maxPendingApptsPerClient: number;
    requireConfirmation: boolean;
    holidayClosureAutoApply: boolean;
    allowPassiveTimeBooking: boolean;
    timeZone: string;
  } | null;
  tenantWorkingHours: Array<{
    dayOfWeek: number;
    opensAt: number;
    closesAt: number;
  }>;
}

export interface UpdateGeneralSettingsPayload {
  name?: string;
  slug?: string;
  timeZone?: string;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  coverUrl?: string | null;
  coverPublicId?: string | null;
}

export interface UpdateAppointmentSettingsPayload {
  slotIntervalMinutes?: number;
  maxAdvancedDays?: number;
  minAdvancedMinutes?: number;
  cancellationWindowMinutes?: number;
  maxPendingApptsPerClient?: number;
  requireConfirmation?: boolean;
  holidayClosureAutoApply?: boolean;
  allowPassiveTimeBooking?: boolean;
}
