import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
import { SCHEDULE_EXCEPTIONS_QUERY_KEY } from './use-schedule-exceptions';
import type { ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';

export const useCreateScheduleException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleExceptionFormData) => scheduleExceptionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_EXCEPTIONS_QUERY_KEY });
    },
  });
};
