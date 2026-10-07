import { useQuery } from '@tanstack/react-query';
import { tenantWorkingHoursApi } from '../api/tenant-working-hours-api';
import { workingHoursToForm } from '../utils/working-hours-model';
export const tenantWorkingHoursKey = (tenantId: string) => ['tenant-working-hours', tenantId] as const;
export function useTenantWorkingHours(tenantId: string) {
  return useQuery({
    queryKey: tenantWorkingHoursKey(tenantId),
    enabled: !!tenantId,
    queryFn: async ({ signal }) => workingHoursToForm(await tenantWorkingHoursApi.get(tenantId, signal)),
  });
}
