import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useDashboardOverview(businessId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "overview", businessId],
    queryFn: () => dashboardApi.getOverview(businessId!),
    enabled: !!businessId,
  });
}
