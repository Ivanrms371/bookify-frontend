import { httpClient } from '@/core/http/httpClient';
import {
  type GetProfessionalsParams,
  type ProfessionalsListing,
  type ProfessionalBasic,
  type ProfessionalWithDetails,
} from '../types/professional.types';
import type { CreateProfessionalValues } from '../schemas/create-professional-schema';
import type { UpdateProfessionalValues } from '../schemas/update-professional-schema';

export const professionalApi = {
  getAll: async (params?: GetProfessionalsParams): Promise<ProfessionalBasic[]> =>
    httpClient.get<ProfessionalBasic[]>('/professionals', { params }),

  getListing: (params: GetProfessionalsParams, options: { signal?: AbortSignal; tenantId?: string } = {}) =>
    httpClient.get<ProfessionalsListing>('/professionals', {
      params: { ...params, count: true },
      signal: options.signal,
      expectedTenantId: options.tenantId,
    }),

  getByIdWithDetails: async (id: string): Promise<ProfessionalWithDetails> =>
    httpClient.get<ProfessionalWithDetails>(`/professionals/${id}/details`),

  getById: async (id: string) => {},

  create: (data: CreateProfessionalValues, tenantId: string) =>
    httpClient.post<ProfessionalBasic>('/team/professionals', data, { expectedTenantId: tenantId, skipAuthRetry: true }),

  update: (id: string, data: UpdateProfessionalValues, tenantId: string) =>
    httpClient.put<{ success: true }>(`/team/professionals/${id}`, data, { expectedTenantId: tenantId, skipAuthRetry: true }),

  updateStatus: (id: string, isActive: boolean, tenantId: string) =>
    httpClient.patch<{ success: true }>(`/professionals/${id}/status`, { isActive }, { expectedTenantId: tenantId, skipAuthRetry: true }),

  delete: (id: string, tenantId: string) =>
    httpClient.delete<{ success: true }>(`/team/professionals/${id}`, { expectedTenantId: tenantId, skipAuthRetry: true }),

  getAllServices: async (id: string) => {},

  addService: async (id: string, serviceId: string) => {},

  removeService: async (id: string, serviceId: string) => {},
};
