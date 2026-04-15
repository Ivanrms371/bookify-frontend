export type TenantType = string; // Define proper enum if available

export interface WorkingHourData {
  dayOfWeek: number;
  isActive: boolean;
  startMinutes: number;
  endMinutes: number;
}

export interface Tenant {
  id: string;
  ownerId: string;
  name: string | null;
  slug: string | null;
  type: TenantType | null;
  description: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  phone: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  coverUrl: string | null;
  coverPublicId: string | null;
  isActive: boolean;
  isPublic: boolean;
  onboardingCompleted: boolean;
  onboardingSteps: {
    workingHours: boolean;
    service: boolean;
    team: boolean;
    published: boolean;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  onboarding?: TenantOnboarding;
  settings?: TenantSettings;
  subscription?: {
    plan?: {
      name: string;
    };
  };
}

export interface TenantOnboarding {
  id: string;
  tenantId: string;
  onboardingCompleted: boolean;
  hasService: boolean;
  hasSchedule: boolean;
  hasStaff: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  id: string;
  tenantId: string;
  slotIntervalMinutes: number;
  maxAdvancedDays: number;
  minAdvancedMinutes: number;
  bufferTimeMinutes: number;
  cancellationWindowMinutes: number;
  timezone: string;
  currency: string;
  maxPendingApptsPerClient: number;
  requireConfirmation: boolean;
  holidayClosureAutoApply: boolean;
  allowPassiveTimeBooking: boolean;
}
