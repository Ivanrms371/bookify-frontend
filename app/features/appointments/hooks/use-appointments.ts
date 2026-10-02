import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { appointmentsApi } from '../api/appointments-api';
import type { GetAllAppointmentsParams } from '../types/appointments-types';

export const useAppointments = (params: GetAllAppointmentsParams) => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['appointments', tenantId, params],
    queryFn: () => appointmentsApi.getAll(params),
  });
};
