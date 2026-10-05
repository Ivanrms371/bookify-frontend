import { httpClient } from '@/core/http/httpClient';

export type VerificationType = 'USER_EMAIL_VERIFICATION' | 'USER_PHONE_VERIFICATION' | 'PASSWORD_RESET';

export interface ResendVerificationPayload {
  invitationToken?: string;
  type: VerificationType;
  email: string;
}

export interface VerifyTokenPayload {
  type: VerificationType;
  token: string;
}

export const verificationsApi = {
  resend: (dto: ResendVerificationPayload) => httpClient.post('/verifications/resend', dto),

  verify: (dto: VerifyTokenPayload) => httpClient.post('/verifications/verify', dto),
};
