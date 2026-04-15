import type { ReportsQuery } from "../../types/reports.type";

// ─────────────────────────────────────────────────────────────────────────────
// Query-key factory para reports/owner.
// Un solo punto de verdad para keys → invalidación consistente y type-safe.
// ─────────────────────────────────────────────────────────────────────────────

export const ownerKeys = {
  all: (tenantId: string) => ["reports", "owner", tenantId] as const,
  financialSummary: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "financial-summary", q] as const,
  topServices: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "top-services", q] as const,
  staffPerformance: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "staff-performance", q] as const,
  topCustomers: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "top-customers", q] as const,
  worstCustomers: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "worst-customers", q] as const,
  myPerformance: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "my-performance", q] as const,
  tenantRevenueChart: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "revenue-chart", q] as const,
  staffRevenueChart: (tenantId: string, staffId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "staff-revenue-chart", staffId, q] as const,
  myRevenueChart: (tenantId: string, q: ReportsQuery) =>
    [...ownerKeys.all(tenantId), "my-revenue-chart", q] as const,
};

export const REPORTS_STALE_TIME = 2 * 60 * 1000;
