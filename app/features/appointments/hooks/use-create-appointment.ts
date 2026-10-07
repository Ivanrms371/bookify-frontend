import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';
import type { CreateAppointmentInput } from '../schemas/create-appointment-schema';

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentInput) => appointmentsApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
