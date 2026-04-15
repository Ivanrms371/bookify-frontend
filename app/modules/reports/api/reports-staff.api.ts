import { apiClient } from "@/shared/api/client";
import type { 
  ReportsQuery, 
  CustomerReport, 
  MyPerformance, 
  RevenueChartData 
} from "../types/reports.type";

export const reportsStaffApi = {
  getMyPerformance: async (tenantId: string, query: ReportsQuery): Promise<MyPerformance> => {
    const response = await apiClient.get(`/tenants/${tenantId}/staff/reports/my-performance`, { params: query });
    return response.data;
  },

  getMyTopCustomers: async (tenantId: string, query: ReportsQuery): Promise<CustomerReport[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/staff/reports/my-customers`, { params: query });
    return response.data;
  },

  getMyWorstCustomers: async (tenantId: string, query: ReportsQuery): Promise<CustomerReport[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/staff/reports/my-worst-customers`, { params: query });
    return response.data;
  },

  getMyRevenueChart: async (tenantId: string, query: ReportsQuery): Promise<RevenueChartData[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/staff/reports/my-revenue-chart`, { params: query });
    return response.data;
  },
};
