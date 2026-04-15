import { apiClient } from "@/shared/api/client"
import type { Customer } from "../types/customer.types"
import type { CustomersQueryParams } from "../types/customer-query.types.ts"

export const customerApi = {
  getCustomers: async (tenantId: string, params?: CustomersQueryParams) => {
    const { data } = await apiClient.get<Customer[]>(
      `/tenants/${tenantId}/customers`,
      {
        params,
      },
    )

    return data
  },

  getCustomerById: async (tenantId: string, id: string) => {
    const { data } = await apiClient.get<Customer>(
      `/tenants/${tenantId}/customers/${id}`,
    )

    return data
  },

  createCustomer: async (
    tenantId: string,
    data: Omit<Customer, "id" | "tenantId" | "createdAt" | "updatedAt">,
  ) => {
    const response = await apiClient.post(`/tenants/${tenantId}/customers`, data)
    return response.data
  },

  updateCustomer: async (tenantId: string, id: string, data: Partial<Customer>) => {
    const response = await apiClient.put(`/tenants/${tenantId}/customers/${id}`, data)
    return response.data
  },

  updateCustomerNotes: async (tenantId: string, id: string, notes: string) => {
    const response = await apiClient.patch(
      `/tenants/${tenantId}/customers/${id}/notes`,
      { notes },
    )
    return response.data
  },

  blockCustomer: async (tenantId: string, id: string) => {
    const response = await apiClient.patch(
      `/tenants/${tenantId}/customers/${id}/block`,
    )
    return response.data
  },

  unblockCustomer: async (tenantId: string, id: string) => {
    const response = await apiClient.patch(
      `/tenants/${tenantId}/customers/${id}/unblock`,
    )
    return response.data
  },

  deleteCustomer: async (tenantId: string, id: string) => {
    const { data } = await apiClient.delete(`/tenants/${tenantId}/customers/${id}`)
    return data
  },
}
