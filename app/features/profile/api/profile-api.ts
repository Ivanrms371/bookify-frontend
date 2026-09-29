import { httpClient } from '@/core/http/httpClient';

export interface ProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    avatarUrl: string | null;
    phoneVerifiedAt: string | null;
    hasPassword: boolean;
    hasGoogle: boolean;
    createdAt: string;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    bio: string | null;
    professional: {
      id: string;
      name: string;
      email: string;
      phoneCountryCode: string;
      phoneNumber: string;
      isActive: boolean;
      profession: string | null;
      bio: string | null;
      avatarUrl: string | null;
      colorTheme: string | null;
      slotIntervalMinutes: number;
      maxAdvancedDays: number;
      minAdvancedMinutes: number;
      usesTenantSchedule?: boolean;
      workingHours?: { dayOfWeek: number; opensAt: number; closesAt: number }[];
    } | null;
  };
}

export class ProfileService {
  static async getProfile(): Promise<ProfileResponse> {
    const data = await httpClient.get<ProfileResponse>('/users/me/profile');
    return data;
  }
}
