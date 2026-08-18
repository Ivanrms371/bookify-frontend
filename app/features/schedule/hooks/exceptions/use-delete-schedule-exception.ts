import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
import { SCHEDULE_EXCEPTIONS_QUERY_KEY } from './use-schedule-exceptions';

export const useDeleteScheduleException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleExceptionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_EXCEPTIONS_QUERY_KEY });
    },
  });
};
