import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';
import type { GetAllAppointmentsParams } from '../types/appointments-types';

export const useAppointments = (params: GetAllAppointmentsParams) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsApi.getAll(params),
  });
};
