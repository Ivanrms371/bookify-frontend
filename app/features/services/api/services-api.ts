import { httpClient } from '@/core/http/httpClient';
import type { GetAllServicesParams, GetAllServicesResponse, Service, CreateServicePayload } from '../types/services.types';
import type { ProfessionalBasic } from '@/features/professional/types/professional.types';

export const servicesApi = {
  getAll: (params?: GetAllServicesParams) => httpClient.get<GetAllServicesResponse>(`/services`, { params }),

  getById: (id: string) => httpClient.get<Service>(`/services/${id}`),

  create: (payload: CreateServicePayload) => httpClient.post(`/services`, payload),

  update: (id: string, payload: Partial<CreateServicePayload>) => httpClient.put(`/services/${id}`, payload),

  toggleStatus: (id: string) => httpClient.patch<Service>(`/services/${id}/toggle-status`),

  delete: (id: string) => httpClient.delete(`/services/${id}`),

  getAllProfessionals: (id: string) => httpClient.get<ProfessionalBasic[]>(`services/${id}/professionals`),

  createMany: async (services: CreateServicePayload[]) => {
    for (const service of services) {
      await servicesApi.create(service);
    }
  },
};
