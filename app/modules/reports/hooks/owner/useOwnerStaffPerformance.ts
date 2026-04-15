import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { reportsOwnerApi } from "../../api/reports-owner.api";
import type { ReportsQuery } from "../../types/reports.type";
import { ownerKeys, REPORTS_STALE_TIME } from "./keys";

/**
 * Rendimiento de cada miembro del staff: ingresos generados, comisión, monto a pagar.
 * Alimenta la tabla de liquidación / ranking del equipo.
 */
export const useOwnerStaffPerformance = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.staffPerformance(tenantId!, query),
    queryFn: () => reportsOwnerApi.getStaffPerformance(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};
