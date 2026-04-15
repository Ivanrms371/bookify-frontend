import { useMemo } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { ReportsQuery } from "../types/reports.type";

// ── Re-export hooks granulares para uso directo en componentes hijos ──
export {
  ownerKeys,
  useOwnerFinancialSummary,
  useOwnerTopServices,
  useOwnerStaffPerformance,
  useOwnerCustomerInsights,
  useOwnerMyPerformance,
  useOwnerMyRevenueChart,
  useOwnerTenantRevenueChart,
  useOwnerStaffRevenueChart,
} from "./owner";

// ─────────────────────────────────────────────────────────────────────────────
// useOwnerReports — hook orquestador para la vista de reportes del owner.
//
// NO ejecuta queries. Su único propósito es:
//  1. Estabilizar el `query` object con `useMemo` (evita re-renders cascada).
//  2. Proveer `session` y el `query` estable para que los componentes hijos
//     lo pasen a sus hooks granulares.
//
// Patrón recomendado:
//   ReportsOwnerView  →  useOwnerReports (query + session)
//     ├── StatsCards   →  useOwnerMyPerformance(query)
//     ├── Chart        →  useOwnerMyRevenueChart(query)
//     ├── Insights     →  useOwnerCustomerInsights(query)
//     └── Table        →  useOwnerTopServices(query)
//
// Cada componente hijo se suscribe SOLO a su query → cuando "topServices"
// resuelve, SOLO la tabla re-renderiza, no las StatsCards ni el Chart.
// ─────────────────────────────────────────────────────────────────────────────

interface OwnerReportsParams {
  startDate: string;
  endDate: string;
  limit?: number;
}

export const useOwnerReports = ({ startDate, endDate, limit = 10 }: OwnerReportsParams) => {
  const { session } = useAuth();

  // ── Query estable: solo cambia si startDate/endDate/limit realmente cambian ──
  const query = useMemo<ReportsQuery>(
    () => ({ startDate, endDate, limit }),
    [startDate, endDate, limit],
  );

  return { query, session };
};