import { httpClient } from '@/core/api/httpClient';

export interface ProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    bio: string | null;
    professional: {
      id: string;
      name: string;
      email: string;
      profession: string | null;
      bio: string | null;
      avatarUrl: string | null;
      colorTheme: string | null;
      slotIntervalMinutes: number;
    } | null;
  };
}

export class ProfileService {
  static async getProfile(): Promise<ProfileResponse> {
    const { data } = await httpClient.get<ProfileResponse>('/users/me/profile');
    return data;
  }
}
