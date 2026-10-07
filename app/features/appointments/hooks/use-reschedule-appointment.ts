import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';
import type { RescheduleAppointmentInput } from '../schemas/reschedule-appointment-schema';

export const useRescheduleAppointment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RescheduleAppointmentInput) => appointmentsApi.reschedule(id, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['appointments'] }),
        queryClient.invalidateQueries({ queryKey: ['availability'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
        queryClient.invalidateQueries({ queryKey: ['customers'] }),
      ]);
    },
  });
};
