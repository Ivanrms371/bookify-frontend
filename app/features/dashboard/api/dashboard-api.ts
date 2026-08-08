import { httpClient } from "@/core/http/httpClient";
import type { DashboardOverviewResponse } from "../types/dashboard.types";

export const dashboardApi = {
    getDashboardOverview: async (): Promise<DashboardOverviewResponse> =>
        httpClient.get<DashboardOverviewResponse>("/dashboard/overview")
}