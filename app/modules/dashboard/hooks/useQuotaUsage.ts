import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useQuotaUsage(tenantId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "quota-usage", tenantId],
    queryFn: () => dashboardApi.getQuotaUsage(tenantId!),
    enabled: !!tenantId,
  });
}
