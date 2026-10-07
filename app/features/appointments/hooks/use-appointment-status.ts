import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments-api';

export const useAppointmentStatus = (id: string, tenantId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW') => appointmentsApi.changeStatus(id, status, tenantId),
    onSuccess: async () => {
      await Promise.all(['appointments', 'availability', 'dashboard-overview', 'reports', 'customers'].map(
        (key) => queryClient.invalidateQueries({ queryKey: [key] }),
      ));
    },
  });
};
