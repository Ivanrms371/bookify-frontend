import { apiClient } from "@/shared/api/client"
import type { ServicesQueryParams } from "../types/services-query.types"
import type { Service } from "../types/service.types"
import type { CreateServiceInput } from "../types/service-create.type"
import type { UpdateServiceInput } from "../types/service-update.type"
import { buildServiceFormData } from "../lib/buildServiceFormData"

export const serviceApi = {
  getServices: async (
    tenantId: string,
    params?: ServicesQueryParams,
  ): Promise<Service[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/services`, {
      params,
    })
    console.log(response.data)
    return response.data
  },

  getServiceById: async (tenantId: string, id: string): Promise<Service> => {
    const response = await apiClient.get(`/tenants/${tenantId}/services/${id}`)
    return response.data
  },

  createService: async (tenantId: string, data: CreateServiceInput) => {
    const formData = buildServiceFormData(data);
    const response = await apiClient.post(
      `/tenants/${tenantId}/services`,
      formData,
    )
    return response.data
  },

  updateService: async (
    tenantId: string,
    id: string,
    data: Partial<UpdateServiceInput>,
  ) => {
    const formData = buildServiceFormData(data);
    const response = await apiClient.put(
      `/tenants/${tenantId}/services/${id}`,
      formData,
    )
    console.log(response.data)
    return response.data
  },

  reorderServices: async (
    tenantId: string,
    orders: { id: string; displayOrder: number }[],
  ) => {
    const response = await apiClient.patch(
      `/tenants/${tenantId}/services/reorder`,
      orders,
    )
    return response.data
  },

  deleteService: async (tenantId: string, id: string) => {
    const response = await apiClient.delete(
      `/tenants/${tenantId}/services/${id}`,
    )
    return response.data
  },
}
