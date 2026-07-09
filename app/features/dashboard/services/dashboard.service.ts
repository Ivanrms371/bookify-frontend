import { httpClient } from "@/core/http/httpClient";
import type { DashboardOverviewResponse } from "../types/dashboard.types";

export const dashboardService = {
    getDashboardOverview: async () => 
        httpClient.get<DashboardOverviewResponse>("/portal/dashboard/overview")
}