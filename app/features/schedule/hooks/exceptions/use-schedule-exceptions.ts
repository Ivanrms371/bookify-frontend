import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
export const scheduleExceptionsKey = (tenantId?: string) => ['schedule-exceptions', tenantId] as const;
export function useScheduleExceptions() {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: scheduleExceptionsKey(tenantId),
    enabled: !!tenantId,
    queryFn: ({ signal }) => scheduleExceptionApi.getAll(tenantId!, signal),
  });
}
