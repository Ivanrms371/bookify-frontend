import { httpClient } from '@/core/http/httpClient';
import { type ProfessionalBasic } from '../types/professional.types';

export const professionalApi = {
  getAll: async (params?: any): Promise<ProfessionalBasic[]> => httpClient.get<ProfessionalBasic[]>('/professionals', { params }),

  getById: async (id: string) => {},

  create: async (data: any) => {},

  update: async (id: string, data: any) => {},

  delete: async (id: string) => {},

  getAllServices: async (id: string) => {},

  addService: async (id: string, serviceId: string) => {},

  removeService: async (id: string, serviceId: string) => {},
};
