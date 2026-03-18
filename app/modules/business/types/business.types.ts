export type BusinessType = string; // Define proper enum if available

export interface Business {
  id: string;
  ownerId: string;
  name: string | null;
  slug: string | null;
  type: BusinessType | null;
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

  onboarding?: BusinessOnboarding;
  settings?: BusinessSettings;
  subscription?: {
    plan?: {
      name: string;
    };
  };
}

export interface BusinessOnboarding {
  id: string;
  businessId: string;
  onboardingCompleted: boolean;
  hasService: boolean;
  hasSchedule: boolean;
  hasStaff: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  id: string;
  businessId: string;
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
