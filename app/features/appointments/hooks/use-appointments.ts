import { canKeepAppointmentResults } from '../utils/agenda-model';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { appointmentsApi } from '../api/appointments-api';
import type { GetAllAppointmentsParams } from '../types/appointments-types';

export const useAppointments = (params: GetAllAppointmentsParams, timeZone?: string) => {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const tenantId = tenant?.id;
  const scope = JSON.stringify([tenant?.professionalId, tenant?.permissions]);
  return useQuery({
    queryKey: ['appointments', tenantId, params, timeZone, scope],
    enabled: !!tenantId,
    queryFn: ({ signal }) => appointmentsApi.getAll(params, { signal, tenantId }),
    placeholderData: (previousData, previousQuery) =>
      previousQuery && previousQuery.queryKey[4] === scope && canKeepAppointmentResults(tenantId, params, previousQuery.queryKey, timeZone) ? previousData : undefined,
  });
};
