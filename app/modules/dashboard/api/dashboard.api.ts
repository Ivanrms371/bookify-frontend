import { apiClient } from "@/shared/api/client";

export interface DashboardOverview {
  totalRevenueMonth: number | string;
  appointmentsToday: number;
  newCustomersMonth: number;
  totalCustomersLifetime: number;
  totalAppointments: number;
  totalConfirmed: number;
  totalCancelled: number;
  totalCompleted: number;
  totalNoShow: number;
  totalCustomers: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface QuotaMetric {
  used: number;
  limit: number;
  percentage: number;
}

export interface QuotaUsage {
  email: QuotaMetric;
  whatsapp: QuotaMetric;
  appointment: QuotaMetric;
  professional: QuotaMetric;
  periodMonth: number;
  periodYear: number;
}

export const dashboardApi = {
  getOverview: async (businessId: string): Promise<DashboardOverview> => {
    const response = await apiClient.get(
      `/business/${businessId}/dashboard/overview`,
    );
    return response.data;
  },

  getRevenueChart: async (businessId: string): Promise<DailyRevenue[]> => {
    const response = await apiClient.get(
      `/business/${businessId}/dashboard/revenue-chart`,
    );
    return response.data;
  },

  getQuotaUsage: async (businessId: string): Promise<QuotaUsage | null> => {
    const response = await apiClient.get(
      `/business/${businessId}/dashboard/quota-usage`,
    );
    return response.data;
  },
};
