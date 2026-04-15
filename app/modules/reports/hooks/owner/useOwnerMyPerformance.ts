import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { reportsOwnerApi } from "../../api/reports-owner.api";
import type { ReportsQuery } from "../../types/reports.type";
import { ownerKeys, REPORTS_STALE_TIME } from "./keys";

/**
 * Estadísticas personales del owner: turnos completados, comisiones, días activos.
 * Alimenta las StatsCards de "Turnos Totales" y "Mis Ganancias".
 */
export const useOwnerMyPerformance = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.myPerformance(tenantId!, query),
    queryFn: () => reportsOwnerApi.getMyPerformance(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};
