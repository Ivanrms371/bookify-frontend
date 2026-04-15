import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useDailyRevenue(tenantId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "revenue-chart", tenantId],
    queryFn: () => dashboardApi.getRevenueChart(tenantId!),
    enabled: !!tenantId,
  });
}
