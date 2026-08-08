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
  avatarUrl: string | null;
  displayName: string;
  colorTheme: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
};
