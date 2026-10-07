import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { can } from '@/core/auth/permissions';
import { reportsApi } from '../api/reports-api';
import { normalizeReportRequest, validateReportDates } from '../utils/report-request';
import type { ReportsFilters } from '../types/reports.types';

export function useReportsOverview(filters: ReportsFilters) {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const tenantId = tenant?.id;
  const enabled = !!tenantId && can(tenant, 'report:read');
  const options = useQuery({
    queryKey: ['reports', tenantId, 'filter-options'],
    enabled,
    queryFn: ({ signal }) => reportsApi.getFilterOptions(tenantId!, signal),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
  const validationError = validateReportDates(filters, options.data?.timeZone);
  const params = normalizeReportRequest(filters);
  const overview = useQuery({
    queryKey: ['reports', tenantId, 'overview', params],
    enabled: enabled && !validationError && (filters.period !== 'custom' || !!options.data),
    queryFn: ({ signal }) => reportsApi.getOverview(params, tenantId!, signal),
    placeholderData: (previous, previousQuery) => enabled && previousQuery?.queryKey[1] === tenantId ? previous : undefined,
    refetchOnWindowFocus: true,
  });
  return { options, overview, validationError };
}
