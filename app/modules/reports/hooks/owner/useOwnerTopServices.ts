import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { reportsOwnerApi } from "../../api/reports-owner.api";
import type { ReportsQuery } from "../../types/reports.type";
import { ownerKeys, REPORTS_STALE_TIME } from "./keys";

/**
 * Lista de servicios ordenados por ingresos generados (descendente).
 * Usado para la tabla "Rendimiento por Servicio" y la StatsCard "Servicio top".
 */
export const useOwnerTopServices = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.topServices(tenantId!, query),
    queryFn: () => reportsOwnerApi.getTopServices(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};
