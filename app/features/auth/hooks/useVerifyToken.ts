import { useMutation } from '@tanstack/react-query';
import { verificationsApi } from '../api/verifications-api';

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: verificationsApi.verify,
  });
};
