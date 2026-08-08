import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "../api/dashboard-api"
import type { DashboardOverviewResponse } from "../types/dashboard.types"

export const useDashboardOverview = () => {
    return useQuery<DashboardOverviewResponse>({
        queryKey: ["dashboard-overview"],
        queryFn: dashboardApi.getDashboardOverview
    });
}