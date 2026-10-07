import { httpClient } from '@/core/http/httpClient';
import type { ImageType, UploadResult, DeleteResult } from '../types';

export const mediaApi = {
  upload: (file: File, type: ImageType, tenantId?: string): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post<UploadResult>(`/media/upload?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      expectedTenantId: tenantId,
      skipAuthRetry: true,
    });
  },

  delete: (publicId: string, tenantId?: string): Promise<DeleteResult> =>
    httpClient.delete<DeleteResult>(`/media/${encodeURIComponent(publicId)}`, { expectedTenantId: tenantId, skipAuthRetry: true }),
};
