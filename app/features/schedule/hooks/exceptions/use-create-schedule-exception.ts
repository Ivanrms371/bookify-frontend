import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
import { scheduleExceptionsKey } from './use-schedule-exceptions';
import type { ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
export function useCreateScheduleException(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (data: ScheduleExceptionFormData) => scheduleExceptionApi.create(data, tenantId),
    onSuccess: () => {
      void queries.invalidateQueries({ queryKey: scheduleExceptionsKey(tenantId) });
      void queries.invalidateQueries({ queryKey: ['appointments', tenantId] });
    },
  });
}
