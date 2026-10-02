type CommissionType = 'PERCENTAGE' | 'FIXED';

export type Professional = {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string;
  name: string;
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
  avatarUrl: string | null;
  name: string;
  colorTheme: string | null;
  bio: string | null;
  isActive?: boolean;
  role?: Role | null;
  email?: string | null;
  phoneNumber?: string | null;
  phoneCountryCode?: string | null;
};

import type { Role } from '@/shared/types';

export type ProfessionalWithDetails = {
  id: string;
  userId: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
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

export type GetProfessionalsParams = {
  query?: string;
  isActive?: boolean;
  serviceId?: string;
  orderBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  skip?: number;
  take?: number;
};
export type ProfessionalsListing = {
  data: ProfessionalBasic[];
  meta: { total: number; skip: number; take: number };
};
