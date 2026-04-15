import { apiClient } from "@/shared/api/client";
import type { 
  ReportsQuery, 
  FinancialSummary, 
  TopService, 
  StaffPerformance, 
  CustomerReport, 
  MyPerformance, 
  RevenueChartData 
} from "../types/reports.type";

export const reportsOwnerApi = {
  getFinancialSummary: async (tenantId: string, query: ReportsQuery): Promise<FinancialSummary> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/financial-summary`, { params: query });
    return response.data;
  },

  getTopServices: async (tenantId: string, query: ReportsQuery): Promise<TopService[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/top-services`, { params: query });
    return response.data;
  },

  getStaffPerformance: async (tenantId: string, query: ReportsQuery): Promise<StaffPerformance[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/staff-performance`, { params: query });
    return response.data;
  },

  getTopCustomers: async (tenantId: string, query: ReportsQuery): Promise<CustomerReport[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/top-customers`, { params: query });
    return response.data;
  },

  getWorstCustomers: async (tenantId: string, query: ReportsQuery): Promise<CustomerReport[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/worst-customers`, { params: query });
    return response.data;
  },

  getMyPerformance: async (tenantId: string, query: ReportsQuery): Promise<MyPerformance> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/my-performance`, { params: query });
    return response.data;
  },

  getTenantRevenueChart: async (tenantId: string, query: ReportsQuery): Promise<RevenueChartData[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/revenue-chart`, { params: query });
    return response.data;
  },

  getStaffRevenueChart: async (tenantId: string, staffId: string, query: ReportsQuery): Promise<RevenueChartData[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/staffs/${staffId}/revenue-chart`, { params: query });
    return response.data;
  },

  getMyRevenueChart: async (tenantId: string, query: ReportsQuery): Promise<RevenueChartData[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/owner/reports/my-revenue-chart`, { params: query });
    return response.data;
  },
};
