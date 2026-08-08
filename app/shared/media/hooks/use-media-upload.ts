import { useMutation } from '@tanstack/react-query';
import { mediaApi } from '../api/media-api';
import type { ImageType, UploadResult } from '../types';

interface UploadParams {
  file: File;
  type: ImageType;
}

export const useMediaUpload = () => {
  return useMutation<UploadResult, Error, UploadParams>({
    mutationFn: ({ file, type }: UploadParams) => mediaApi.upload(file, type),
  });
};
