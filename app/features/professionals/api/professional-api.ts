import { httpClient } from '@/core/http/httpClient';
import {
  type GetProfessionalsParams,
  type ProfessionalsListing,
  type ProfessionalBasic,
  type ProfessionalWithDetails,
} from '../types/professional.types';
import type { ProfessionalFormValues } from '../schemas/professional-form-schema';

export const professionalApi = {
  getAll: async (params?: GetProfessionalsParams): Promise<ProfessionalBasic[]> =>
    httpClient.get<ProfessionalBasic[]>('/professionals', { params }),

  getListing: (params: GetProfessionalsParams) =>
    httpClient.get<ProfessionalsListing>('/professionals', { params: { ...params, count: true } }),

  getByIdWithDetails: async (id: string): Promise<ProfessionalWithDetails> =>
    httpClient.get<ProfessionalWithDetails>(`/professionals/${id}/details`),

  getById: async (id: string) => {},

  create: async (data: any) => {},

  update: async (id: string, data: ProfessionalFormValues) => httpClient.put(`/professionals/${id}`, data),

  delete: async (id: string) => {},

  getAllServices: async (id: string) => {},

  addService: async (id: string, serviceId: string) => {},

  removeService: async (id: string, serviceId: string) => {},
};
