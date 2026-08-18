import { useQuery } from '@tanstack/react-query';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
import type { ScheduleException } from '../../types/schedule-exception.types';

export const SCHEDULE_EXCEPTIONS_QUERY_KEY = ['schedule-exceptions'] as const;

export const useScheduleExceptions = () => {
  return useQuery<ScheduleException[]>({
    queryKey: SCHEDULE_EXCEPTIONS_QUERY_KEY,
    queryFn: () => scheduleExceptionApi.getAll(),
  });
};
