import { httpClient } from '@/core/http/httpClient';
import type { CreateServicePayload } from '../schemas/create-service.schema';
import type { Service } from '../types/services.types';

function buildCreateServiceFormData(service: CreateServicePayload): FormData {
  const form = new FormData();
  form.append('name', service.name);
  form.append('price', String(service.price));
  form.append('durationMinutes', String(service.durationMinutes));
  form.append('isActive', 'true');
  form.append('discountPercentage', String(service.discountPercentage ?? 0));
  form.append('discountFixed', String(service.discountFixed ?? 0));

  if (service.description) {
    form.append('description', service.description);
  }

  if (service.image instanceof File) {
    form.append('image', service.image);
  }

  return form;
}

export const servicesService = {
  getAll: (tenantId: string) => httpClient.get<Service[]>(`/tenants/${tenantId}/services`),

  create: (tenantId: string, service: CreateServicePayload) => {
    return httpClient.post(`/tenants/${tenantId}/services`, buildCreateServiceFormData(service), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  createMany: async (tenantId: string, services: CreateServicePayload[]) => {
    for (const service of services) {
      await servicesService.create(tenantId, service);
    }
  },
};
