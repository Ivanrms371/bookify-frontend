import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"
import { useTenant } from "@/shared/context/tenant.context"
import type { Customer } from "../types/customer.types"
import type { CustomersQueryParams } from "../types/customer-query.types.ts"

type UseCustomersOptions = Omit<
  UseQueryOptions<Customer[]>,
  "queryKey" | "queryFn"
>

export function useCustomers(
  params?: CustomersQueryParams,
  options?: UseCustomersOptions,
) {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ["customers", tenantId, JSON.stringify(params)],

    queryFn: () => customerApi.getCustomers(tenantId, params),

    enabled: !!tenantId && (options?.enabled ?? true),

    ...options,
  })
}
