import { useMutation } from '@tanstack/react-query';
import { mediaApi } from '../api/media-api';
import type { DeleteResult } from '../types';

export const useMediaDelete = () => {
  return useMutation<DeleteResult, Error, string>({
    mutationFn: (publicId: string) => mediaApi.delete(publicId),
  });
};
