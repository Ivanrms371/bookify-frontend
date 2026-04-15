import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { reportsAdminApi } from "../api/reports-admin.api";
import type { ReportsQuery } from "../types/reports.type";

// ─────────────────────────────────────────────────────────────────────────────
// Stale time compartido — los datos de reportes no cambian cada segundo,
// 2 minutos de cache evita refetches innecesarios al navegar entre tabs.
// ─────────────────────────────────────────────────────────────────────────────
const REPORTS_STALE_TIME = 2 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────────────────
// Query-key factory — centraliza las keys para invalidación consistente.
// ─────────────────────────────────────────────────────────────────────────────
const adminKeys = {
  all: (tenantId: string) => ["reports", "admin", tenantId] as const,
  topServices: (tenantId: string, q: ReportsQuery) =>
    [...adminKeys.all(tenantId), "top-services", q] as const,
  topCustomers: (tenantId: string, q: ReportsQuery) =>
    [...adminKeys.all(tenantId), "top-customers", q] as const,
  worstCustomers: (tenantId: string, q: ReportsQuery) =>
    [...adminKeys.all(tenantId), "worst-customers", q] as const,
  myPerformance: (tenantId: string, q: ReportsQuery) =>
    [...adminKeys.all(tenantId), "my-performance", q] as const,
  staffRevenueChart: (tenantId: string, staffId: string, q: ReportsQuery) =>
    [...adminKeys.all(tenantId), "staff-revenue-chart", staffId, q] as const,
};

export { adminKeys };

// ─────────────────────────────────────────────────────────────────────────────
// Hook individual — siempre exportado por si un componente hijo solo necesita
// una pieza de datos sin suscribirse al resto.
// ─────────────────────────────────────────────────────────────────────────────

export const useAdminTopServices = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: adminKeys.topServices(tenantId!, query),
    queryFn: () => reportsAdminApi.getTopServices(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useAdminTopCustomers = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: adminKeys.topCustomers(tenantId!, query),
    queryFn: () => reportsAdminApi.getTopCustomers(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useAdminWorstCustomers = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: adminKeys.worstCustomers(tenantId!, query),
    queryFn: () => reportsAdminApi.getWorstCustomers(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useAdminMyPerformance = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: adminKeys.myPerformance(tenantId!, query),
    queryFn: () => reportsAdminApi.getMyPerformance(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useAdminStaffRevenueChart = (staffId: string, query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: adminKeys.staffRevenueChart(tenantId!, staffId, query),
    queryFn: () => reportsAdminApi.getStaffRevenueChart(tenantId!, staffId, query),
    enabled: !!tenantId && !!staffId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook consolidado para la vista Admin.
//
// ¿Por qué un hook consolidado?
//  - Un solo punto de acceso a `useTenant()` y `useAuth()`.
//  - El `query` object se estabiliza con `useMemo` para que no genere nuevas
//    referencias en cada render (evita refetch cascada).
//  - Se expone `isLoading` global calculado y datos ya sin .data wrapper.
//  - El componente solo se re-renderiza cuando realmente cambia un dato.
// ─────────────────────────────────────────────────────────────────────────────

interface AdminReportsParams {
  startDate: string;
  endDate: string;
  limit?: number;
}

export const useAdminReportsView = ({ startDate, endDate, limit = 10 }: AdminReportsParams) => {
  const { tenantId } = useTenant();
  const { session } = useAuth();
  const staffId = session?.id ?? "";

  // ── Query estable: solo cambia si startDate/endDate/limit realmente cambian ──
  const query = useMemo<ReportsQuery>(
    () => ({ startDate, endDate, limit }),
    [startDate, endDate, limit],
  );

  const enabled = !!tenantId;

  const topServices = useQuery({
    queryKey: adminKeys.topServices(tenantId!, query),
    queryFn: () => reportsAdminApi.getTopServices(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const topCustomers = useQuery({
    queryKey: adminKeys.topCustomers(tenantId!, query),
    queryFn: () => reportsAdminApi.getTopCustomers(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const worstCustomers = useQuery({
    queryKey: adminKeys.worstCustomers(tenantId!, query),
    queryFn: () => reportsAdminApi.getWorstCustomers(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const performance = useQuery({
    queryKey: adminKeys.myPerformance(tenantId!, query),
    queryFn: () => reportsAdminApi.getMyPerformance(tenantId!, query),
    enabled,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const revenueChart = useQuery({
    queryKey: adminKeys.staffRevenueChart(tenantId!, staffId, query),
    queryFn: () => reportsAdminApi.getStaffRevenueChart(tenantId!, staffId, query),
    enabled: enabled && !!staffId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  // ── Datos derivados ──
  const topService = topServices.data?.[0] ?? null;
  const topCustomer = topCustomers.data?.[0] ?? null;

  const isLoading =
    topServices.isLoading ||
    topCustomers.isLoading ||
    worstCustomers.isLoading ||
    performance.isLoading ||
    revenueChart.isLoading;

  return {
    // Datos directos (sin wrapper .data)
    topServices: topServices.data ?? [],
    topCustomers: topCustomers.data ?? [],
    worstCustomers: worstCustomers.data ?? [],
    performance: performance.data ?? null,
    revenueChart: revenueChart.data ?? [],

    // Derivados útiles para las StatsCards
    topService,
    topCustomer,

    // Estado de carga
    isLoading,
    isTopServicesLoading: topServices.isLoading,
    isTopCustomersLoading: topCustomers.isLoading,
    isWorstCustomersLoading: worstCustomers.isLoading,
    isPerformanceLoading: performance.isLoading,
    isRevenueChartLoading: revenueChart.isLoading,
    isCustomerInsightsLoading: topCustomers.isLoading || worstCustomers.isLoading,

    // Session data
    session,
  };
};