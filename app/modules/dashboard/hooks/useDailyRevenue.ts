import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useDailyRevenue(businessId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "revenue-chart", businessId],
    queryFn: () => dashboardApi.getRevenueChart(businessId!),
    enabled: !!businessId,
  });
}
