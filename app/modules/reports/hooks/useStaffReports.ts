import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { reportsStaffApi } from "../api/reports-staff.api";
import type { ReportsQuery } from "../types/reports.type";

// ─────────────────────────────────────────────────────────────────────────────
// Cache: 2 min de staleTime.
// ─────────────────────────────────────────────────────────────────────────────
const REPORTS_STALE_TIME = 2 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────────────────
// Query-key factory
// ─────────────────────────────────────────────────────────────────────────────
const staffKeys = {
  all: (tenantId: string) => ["reports", "staff", tenantId] as const,
  myPerformance: (tenantId: string, q: ReportsQuery) =>
    [...staffKeys.all(tenantId), "my-performance", q] as const,
  myTopCustomers: (tenantId: string, q: ReportsQuery) =>
    [...staffKeys.all(tenantId), "my-customers", q] as const,
  myWorstCustomers: (tenantId: string, q: ReportsQuery) =>
    [...staffKeys.all(tenantId), "my-worst-customers", q] as const,
  myRevenueChart: (tenantId: string, q: ReportsQuery) =>
    [...staffKeys.all(tenantId), "my-revenue-chart", q] as const,
};

export { staffKeys };

// ─────────────────────────────────────────────────────────────────────────────
// Hooks individuales
// ─────────────────────────────────────────────────────────────────────────────

export const useStaffMyPerformance = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: staffKeys.myPerformance(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyPerformance(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useStaffMyTopCustomers = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: staffKeys.myTopCustomers(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyTopCustomers(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useStaffMyWorstCustomers = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: staffKeys.myWorstCustomers(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyWorstCustomers(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useStaffMyRevenueChart = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: staffKeys.myRevenueChart(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyRevenueChart(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook consolidado para ReportsStaffView.
//
// El staff tiene el dashboard más liviano (4 queries), pero las mismas
// optimizaciones aplican: query estabilizado, staleTime, keepPreviousData.
// ─────────────────────────────────────────────────────────────────────────────

interface StaffReportsParams {
  startDate: string;
  endDate: string;
  limit?: number;
}

export const useStaffReportsView = ({ startDate, endDate, limit = 10 }: StaffReportsParams) => {
  const { tenantId } = useTenant();
  const { session } = useAuth();

  // ── Query estable ──
  const query = useMemo<ReportsQuery>(
    () => ({ startDate, endDate, limit }),
    [startDate, endDate, limit],
  );

  const enabled = !!tenantId;

  const myPerformance = useQuery({
    queryKey: staffKeys.myPerformance(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyPerformance(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const myTopCustomers = useQuery({
    queryKey: staffKeys.myTopCustomers(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyTopCustomers(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const myWorstCustomers = useQuery({
    queryKey: staffKeys.myWorstCustomers(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyWorstCustomers(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const myRevenueChart = useQuery({
    queryKey: staffKeys.myRevenueChart(tenantId!, query),
    queryFn: () => reportsStaffApi.getMyRevenueChart(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  // ── Datos derivados ──
  const topCustomer = myTopCustomers.data?.[0] ?? null;

  const isLoading =
    myPerformance.isLoading ||
    myTopCustomers.isLoading ||
    myWorstCustomers.isLoading ||
    myRevenueChart.isLoading;

  return {
    // Datos directos
    myPerformance: myPerformance.data ?? null,
    myTopCustomers: myTopCustomers.data ?? [],
    myWorstCustomers: myWorstCustomers.data ?? [],
    myRevenueChart: myRevenueChart.data ?? [],

    // Derivados
    topCustomer,

    // Estado de carga
    isLoading,
    isPerformanceLoading: myPerformance.isLoading,
    isTopCustomersLoading: myTopCustomers.isLoading,
    isWorstCustomersLoading: myWorstCustomers.isLoading,
    isRevenueChartLoading: myRevenueChart.isLoading,
    isCustomerInsightsLoading: myTopCustomers.isLoading || myWorstCustomers.isLoading,

    // Session data
    session,
  };
};