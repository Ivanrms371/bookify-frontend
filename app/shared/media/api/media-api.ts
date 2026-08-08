import { httpClient } from '@/core/http/httpClient';
import type { ImageType, UploadResult, DeleteResult } from '../types';

export const mediaApi = {
  upload: (file: File, type: ImageType): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post<UploadResult>(`/media/upload?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (publicId: string): Promise<DeleteResult> => httpClient.delete<DeleteResult>(`/media/${publicId}`),
};
