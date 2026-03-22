import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useQuotaUsage(businessId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "quota-usage", businessId],
    queryFn: () => dashboardApi.getQuotaUsage(businessId!),
    enabled: !!businessId,
  });
}
