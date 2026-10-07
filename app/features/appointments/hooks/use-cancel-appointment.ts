import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';

export const useCancelAppointment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { cancellationReason?: string }) => appointmentsApi.cancel(id, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['appointments'] }),
        queryClient.invalidateQueries({ queryKey: ['availability'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
      ]);
    },
  });
};
