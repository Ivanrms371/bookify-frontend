import { httpClient } from '@/core/http/httpClient';
import type { UserSessionContext, SignupResponse } from '../types/auth.types';
import type { LoginFormValues } from '../schemas/login.schema';
import type { SignupFormValues } from '../schemas/signup.schema';

export const authApi = {
  signup: (dto: SignupFormValues & { token?: string }) => httpClient.post<SignupResponse>('/auth/signup', dto, { skipAuthRetry: true }),

  login: async (dto: LoginFormValues) => httpClient.post<UserSessionContext>('/auth/login', dto),

  logout: () => httpClient.post('/auth/logout'),

  getMe: (tenantId?: string) =>
    httpClient.get<UserSessionContext>('/auth/me', tenantId ? { headers: { 'x-tenant-id': tenantId } } : undefined),

  refreshToken: async () => httpClient.post<UserSessionContext>('/auth/refresh'),
};
