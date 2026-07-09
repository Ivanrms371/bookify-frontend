import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboard.service"
import type { DashboardOverviewResponse } from "../types/dashboard.types"

export const useDashboardOverview = () => {
    return useQuery<DashboardOverviewResponse>({
        queryKey: ["dashboard-overview"],
        queryFn: dashboardService.getDashboardOverview
    });
}