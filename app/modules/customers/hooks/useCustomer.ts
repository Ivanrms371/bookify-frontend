import { useQuery } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"

export function useCustomer(tenantId: string | undefined, customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer", "detail", tenantId, customerId],
    queryFn: () => customerApi.getCustomerById(tenantId!, customerId!),
    enabled: !!tenantId && !!customerId,
  })
}
