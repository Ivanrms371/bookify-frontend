import { useMutation } from '@tanstack/react-query';
import { verificationsApi } from '../api/verifications-api';

export const useResendVerification = () => {
  return useMutation({
    mutationFn: verificationsApi.resend,
  });
};
