export type ReportsPeriod = 'this-month' | 'last-month' | 'custom';

export interface ReportsFilters {
  period: ReportsPeriod;
  professionalId: string;
  serviceId: string;
  startDate: string;
  endDate: string;
}

export interface ReportsFilterOption {
  id: string;
  name: string;
}

export interface ReportsPeriodTotals {
  revenue: number;
  completed: number;
}

export interface ReportsSummary {
  current: ReportsPeriodTotals;
  previous: ReportsPeriodTotals;
}

export interface ReportsDailyRevenue {
  date: string;
  revenue: number;
}

export interface ReportsPerformanceRow extends ReportsFilterOption {
  completed: number;
  revenue: number;
}

export type ReportsOutcomeKey = 'completed' | 'cancelled' | 'noShow' | 'pendingConfirmed';

export interface ReportsOutcome {
  key: ReportsOutcomeKey;
  count: number;
}

// View data for the whole report. Components never fetch or import fixtures.
export interface ReportsOverviewData {
  summary: ReportsSummary;
  dailyRevenue: ReportsDailyRevenue[];
  topServices: ReportsPerformanceRow[];
  professionals: ReportsPerformanceRow[];
  outcomes: ReportsOutcome[];
}

export interface ReportsFilterOptions {
  professionals: ReportsFilterOption[];
  services: ReportsFilterOption[];
}

export interface ReportsPeriodMetadata {
  startDate: string;
  endDate: string;
  previousStartDate: string;
  previousEndDate: string;
  timeZone: string;
  currency: string;
}

export interface ReportsOverviewResponse extends ReportsOverviewData {
  period: ReportsPeriodMetadata;
}

export interface ReportsFilterOptionsResponse extends ReportsFilterOptions {
  timeZone: string;
  currency: string;
}

export interface ReportsRequest {
  period: ReportsPeriod;
  startDate?: string;
  endDate?: string;
  professionalId?: string;
  serviceId?: string;
  topServicesLimit?: number;
}
