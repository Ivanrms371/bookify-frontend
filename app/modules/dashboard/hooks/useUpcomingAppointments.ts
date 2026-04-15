import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export function useUpcomingAppointments(tenantId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "upcoming", tenantId],
    queryFn: () => dashboardApi.getUpcomingAppointments(tenantId!),
    enabled: !!tenantId,
  });
}
