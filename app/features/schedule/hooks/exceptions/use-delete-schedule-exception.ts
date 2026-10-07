import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
import { scheduleExceptionsKey } from './use-schedule-exceptions';
export function useDeleteScheduleException(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (id: string) => scheduleExceptionApi.delete(id, tenantId),
    onSuccess: () => {
      void queries.invalidateQueries({ queryKey: scheduleExceptionsKey(tenantId) });
      void queries.invalidateQueries({ queryKey: ['appointments', tenantId] });
    },
  });
}
