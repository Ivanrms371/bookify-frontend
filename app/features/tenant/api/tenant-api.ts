import { httpClient } from "@/core/http/httpClient"

import type { TenantAddressInput } from '../types/tenant.type';

export const tenantApi = {
  getBySlug: async (slug: string) => httpClient.get<any>(`/tenants/slug/${slug}`),
  updateAddress: async (tenantId: string, payload: TenantAddressInput) =>
    httpClient.put<any>(`/tenants/${tenantId}/address`, payload),
};