import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { serviceApi } from "../api/service.api"
import { useTenant } from "@/shared/context/tenant.context"
import type { ServicesQueryParams } from "../types/services-query.types"
import type { Service } from "../types/service.types"

type UseServicesOptions = Omit<
  UseQueryOptions<Service[]>,
  "queryKey" | "queryFn"
>

export function useServices(
  params?: ServicesQueryParams,
  options?: UseServicesOptions,
) {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ["services", tenantId, JSON.stringify(params)],
    queryFn: () => serviceApi.getServices(tenantId, params),
    enabled: !!tenantId && (options?.enabled ?? true),
    ...options,
  })
}
