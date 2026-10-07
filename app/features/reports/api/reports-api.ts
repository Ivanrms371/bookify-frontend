import { httpClient } from '@/core/http/httpClient';
import type { ReportsOverviewResponse, ReportsRequest, ReportsFilterOptionsResponse } from '../types/reports.types';

export const reportsApi = {
  getOverview: (params: ReportsRequest, tenantId: string, signal?: AbortSignal): Promise<ReportsOverviewResponse> =>
    httpClient.get<ReportsOverviewResponse>('/reports/overview', { params, expectedTenantId: tenantId, signal }),
  getFilterOptions: (tenantId: string, signal?: AbortSignal): Promise<ReportsFilterOptionsResponse> =>
    httpClient.get<ReportsFilterOptionsResponse>('/reports/filter-options', { expectedTenantId: tenantId, signal }),
};
