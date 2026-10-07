import type {
  ReportsFilters,
  ReportsFilterOptions,
  ReportsOverviewData,
  ReportsPeriodMetadata,
} from './reports.types';

export interface ReportsFiltersProps {
  value: ReportsFilters;
  options: ReportsFilterOptions;
  onChange: (value: ReportsFilters) => void;
  optionsLoading?: boolean;
  dateError?: string;
}

export interface ReportsSummaryProps {
  summary: ReportsOverviewData['summary'];
  currency?: ReportsPeriodMetadata['currency'];
}

export interface ReportsDailyRevenueProps {
  data: ReportsOverviewData['dailyRevenue'];
  currency?: ReportsPeriodMetadata['currency'];
}

export interface ReportsTopServicesProps {
  services: ReportsOverviewData['topServices'];
  currency?: ReportsPeriodMetadata['currency'];
}

export interface ReportsProfessionalsProps {
  professionals: ReportsOverviewData['professionals'];
  currency?: ReportsPeriodMetadata['currency'];
}

export interface ReportsOutcomesProps {
  outcomes: ReportsOverviewData['outcomes'];
}
