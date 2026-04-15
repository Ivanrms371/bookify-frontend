import { apiClient } from "@/shared/api/client";
import type { 
  DashboardOverview, 
  DailyRevenue, 
  QuotaUsage, 
  UpcomingDashboardResponse 
} from "../types/dashboard.types";

export const dashboardApi = {
  getOverview: async (tenantId: string): Promise<DashboardOverview> => {
    const response = await apiClient.get(
      `/tenant/${tenantId}/dashboard/overview`,
    );
    return response.data;
  },

  getUpcomingAppointments: async (tenantId: string): Promise<UpcomingDashboardResponse> => {
    const response = await apiClient.get(
      `/tenant/${tenantId}/dashboard/upcoming-appointments`,
    );
    return response.data;
  },

  getRevenueChart: async (tenantId: string): Promise<DailyRevenue[]> => {
    const response = await apiClient.get(
      `/tenant/${tenantId}/dashboard/revenue-chart`,
    );
    return response.data;
  },

  getQuotaUsage: async (tenantId: string): Promise<QuotaUsage | null> => {
    const response = await apiClient.get(
      `/tenant/${tenantId}/dashboard/quota-usage`,
    );
    return response.data;
  },
};
