import { apiClient } from "@/shared/api/client"
import { useQuery } from "@tanstack/react-query"
import { useTenant } from "@/shared/context/tenant.context"

export const useReports = (from: Date, to: Date) => {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ["reports", tenantId, from.toISOString(), to.toISOString()],
    queryFn: async () => {
      const response = await apiClient.get(
        `/tenants/${tenantId}/reports`,
        {
          params: {
            from: from.toISOString(),
            to: to.toISOString(),
          },
        },
      )
      return response.data
    },
    enabled: !!tenantId,
  })
}
