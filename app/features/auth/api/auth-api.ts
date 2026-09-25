import { httpClient } from '@/core/http/httpClient';
import type { UserSessionContext } from '../types/auth.types';
import type { LoginFormValues } from '../schemas/login.schema';
import type { SignupFormValues } from '../schemas/signup.schema';

export const authApi = {
  signup: async (dto: SignupFormValues) => httpClient.post('/auth/signup', dto),

  login: async (dto: LoginFormValues) => httpClient.post<UserSessionContext>('/auth/login', dto),

  logout: () => httpClient.post('/auth/logout'),

  getMe: () => httpClient.get<UserSessionContext>('/auth/me'),

  refreshToken: async () => httpClient.post<UserSessionContext>('/auth/refresh'),
};
