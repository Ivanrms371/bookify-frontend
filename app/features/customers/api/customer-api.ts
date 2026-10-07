import { httpClient } from '@/core/http/httpClient';
import {
  type Customer,
  type GetCustomerByIdResponse,
  type GetAllCustomersParams,
  type GetAllCustomersResponse,
  type GetCustomersSearchResponse,
} from '../types/customer-types';
import type { CustomerFormData } from '../schemas/customer-form.schema';

export const customerApi = {
  getAll: (params?: GetAllCustomersParams, options: { signal?: AbortSignal; tenantId?: string } = {}) =>
    httpClient.get<GetAllCustomersResponse>('/customers', { params, signal: options.signal, expectedTenantId: options.tenantId }),

  getById: (id: string, options: { signal?: AbortSignal; tenantId?: string } = {}) =>
    httpClient.get<GetCustomerByIdResponse>(`/customers/${id}`, { signal: options.signal, expectedTenantId: options.tenantId }),

  search: (query: string) => httpClient.get<GetCustomersSearchResponse>(`/customers/search`, { params: { query } }),

  create: (data: CustomerFormData) => httpClient.post<Customer>('/customers', data),

  update: (id: string, data: CustomerFormData) => httpClient.put<Customer>(`/customers/${id}`, data),

  delete: (id: string) => httpClient.delete<void>(`/customers/${id}`),

  block: (id: string) => httpClient.patch<void>(`/customers/${id}/block`),

  unblock: (id: string) => httpClient.patch<void>(`/customers/${id}/unblock`),
};
