import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useDashboardOverview(tenantId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "overview", tenantId],
    queryFn: () => dashboardApi.getOverview(tenantId!),
    enabled: !!tenantId,
  });
}
