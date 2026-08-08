import { useMutation } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';
import type { CreateAppointmentInput } from '../schemas/create-appointment-schema';

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: (data: CreateAppointmentInput) => appointmentsApi.create(data),
  });
};
