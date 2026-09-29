import { useQuery } from '@tanstack/react-query';
import { availabilityApi } from '../api/availability-api';
import type { GetAppointmentAvailabilityParams } from '../types/availability-types';

export const useAppointmentAvailability = (params: GetAppointmentAvailabilityParams) => {
  return useQuery({
    queryKey: ['availability', 'appointments', params],
    queryFn: () => availabilityApi.getAppointmentAvailability(params),
    enabled: Boolean(params.serviceId && params.professionalId && params.startDate),
  });
};
