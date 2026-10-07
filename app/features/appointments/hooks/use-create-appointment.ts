import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';
import type { CreateAppointmentInput } from '../schemas/create-appointment-schema';

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentInput) => appointmentsApi.create(data),
    onSuccess: async () => {
      await Promise.all(['appointments', 'availability', 'dashboard-overview', 'reports', 'customers'].map(
        (key) => queryClient.invalidateQueries({ queryKey: [key] }),
      ));
    },
  });
};
