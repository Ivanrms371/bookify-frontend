import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantWorkingHoursApi } from '../api/tenant-working-hours-api';
import { tenantWorkingHoursKey } from './use-tenant-working-hours';
import { settingsQueryKey } from '@/features/settings/hooks/use-get-settings';
import type { SaveWorkingHours } from '../schemas/schedule-form-schema';
import { mapScheduleToDTO } from '../utils/map-schedule-to-dto';
export function useSaveTenantWorkingHours(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (values: SaveWorkingHours) => tenantWorkingHoursApi.save(tenantId, mapScheduleToDTO(values)),
    onSuccess: () => {
      void queries.invalidateQueries({ queryKey: tenantWorkingHoursKey(tenantId) });
      void queries.invalidateQueries({ queryKey: settingsQueryKey(tenantId) });
      void queries.invalidateQueries({ queryKey: ['appointments', tenantId] });
    },
  });
}
