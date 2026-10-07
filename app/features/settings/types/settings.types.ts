export interface TenantSettingsResponse {
  name: string | null;
  slug: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  coverUrl: string | null;
  coverPublicId: string | null;
  phoneNumber: string | null;
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
    day: string;
    isActive: boolean;
    intervals: Array<{ opens: string; closes: string }>;
  }>;
}

export interface UpdateGeneralSettingsPayload {
  name?: string;
  slug?: string;
  timeZone?: string;
  phoneNumber?: string | null;
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
