import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { reportsOwnerApi } from "../../api/reports-owner.api";
import type { ReportsQuery } from "../../types/reports.type";
import { ownerKeys, REPORTS_STALE_TIME } from "./keys";

/**
 * Top y peores clientes en una sola suscripción.
 * Se combinan porque siempre se renderizan juntos en CustomerInsightsList.
 *
 * ¿Por qué dos useQuery y no uno? Porque son endpoints diferentes con
 * datos independientes — TanStack Query los cachea por separado y los
 * refetchea solo cuando cambia el que realmente cambió.
 */
export const useOwnerCustomerInsights = (query: ReportsQuery) => {
  const { tenantId } = useTenant();

  const topCustomers = useQuery({
    queryKey: ownerKeys.topCustomers(tenantId!, query),
    queryFn: () => reportsOwnerApi.getTopCustomers(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const worstCustomers = useQuery({
    queryKey: ownerKeys.worstCustomers(tenantId!, query),
    queryFn: () => reportsOwnerApi.getWorstCustomers(tenantId!, query),
    enabled: !!tenantId,
    staleTime: REPORTS_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    topCustomers: topCustomers.data ?? [],
    worstCustomers: worstCustomers.data ?? [],
    topCustomer: topCustomers.data?.[0] ?? null,
    isLoading: topCustomers.isLoading || worstCustomers.isLoading,
  };
};
