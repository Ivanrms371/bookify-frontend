import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { reportsOwnerApi } from "../../api/reports-owner.api";
import type { ReportsQuery } from "../../types/reports.type";
import { ownerKeys, REPORTS_STALE_TIME } from "./keys";

/**
 * Chart de ingresos del owner (sus ganancias personales).
 * Alimenta el RevenueLineChart del dashboard.
 */
export const useOwnerMyRevenueChart = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.myRevenueChart(tenantId!, query),
    queryFn: () => reportsOwnerApi.getMyRevenueChart(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

/**
 * Chart de ingresos totales del tenant (todo el negocio).
 * Usado cuando el owner quiere ver la vista global del negocio.
 */
export const useOwnerTenantRevenueChart = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.tenantRevenueChart(tenantId!, query),
    queryFn: () => reportsOwnerApi.getTenantRevenueChart(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

/**
 * Chart de ingresos de un staff específico.
 * Solo se activa si se pasa un staffId válido.
 */
export const useOwnerStaffRevenueChart = (staffId: string, query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.staffRevenueChart(tenantId!, staffId, query),
    queryFn: () => reportsOwnerApi.getStaffRevenueChart(tenantId!, staffId, query),
    enabled: !!tenantId && !!staffId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};
