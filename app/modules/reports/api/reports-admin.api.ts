import { apiClient } from "@/shared/api/client";
import type { 
  ReportsQuery, 
  TopService, 
  CustomerReport, 
  MyPerformance, 
  RevenueChartData 
} from "../types/reports.type";

export const reportsAdminApi = {
  getTopServices: async (tenantId: string, query: ReportsQuery): Promise<TopService[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/admin/reports/top-services`, { params: query });
    return response.data;
  },

  getTopCustomers: async (tenantId: string, query: ReportsQuery): Promise<CustomerReport[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/admin/reports/top-customers`, { params: query });
    return response.data;
  },

  getWorstCustomers: async (tenantId: string, query: ReportsQuery): Promise<CustomerReport[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/admin/reports/worst-customers`, { params: query });
    return response.data;
  },

  getMyPerformance: async (tenantId: string, query: ReportsQuery): Promise<MyPerformance> => {
    const response = await apiClient.get(`/tenants/${tenantId}/admin/reports/my-performance`, { params: query });
    return response.data;
  },

  getStaffRevenueChart: async (tenantId: string, staffId: string, query: ReportsQuery): Promise<RevenueChartData[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/admin/reports/staffs/${staffId}/revenue-chart`, { params: query });
    return response.data;
  },
};
