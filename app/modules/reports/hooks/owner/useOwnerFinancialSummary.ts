import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { reportsOwnerApi } from "../../api/reports-owner.api";
import type { ReportsQuery } from "../../types/reports.type";
import { ownerKeys, REPORTS_STALE_TIME } from "./keys";

/**
 * Obtiene el resumen financiero del tenant (grossRevenue, totalCommissions, netRevenue).
 * Ideal para las StatsCards de la cabecera financiera.
 */
export const useOwnerFinancialSummary = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ownerKeys.financialSummary(tenantId!, query),
    queryFn: () => reportsOwnerApi.getFinancialSummary(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });
};
