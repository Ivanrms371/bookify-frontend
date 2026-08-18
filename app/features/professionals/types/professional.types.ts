import type { WeeklySchedule } from '@/shared/constants/week-days';

type CommissionType = 'PERCENTAGE' | 'FIXED';

export type Professional = {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string;
  displayName: string;
  colorTheme: string | null;
  slotIntervalMinutes: number;
  maxAdvancedDays: number;
  minAdvancedMinutes: number;
  commissionType: CommissionType;
  commissionPercent: number | null;
  comissionFixed: number | null;

  createdAt: string;
  updatedAt: string;
};

export type ProfessionalBasic = {
  id: string;
  avatarUrl: string;
  displayName: string;
  colorTheme: string;
  bio: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
};

import type { Role } from '@/shared/types';

export type ProfessionalWithDetails = {
  id: string;
  userId: string;
  avatarUrl: string;
  displayName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  role: Role;
  bio: string;
  commissionType: CommissionType;
  commissionAmount: number;
  serviceIds: string[];
  schedule: {
    workingHours: {
      dayOfWeek: string;
      intervals: { opensAt: string; closesAt: string }[];
    }[];
  };
  slotIntervalMinutes: number;
  maxAdvancedDays: number;
  minAdvancedMinutes: number;
};
