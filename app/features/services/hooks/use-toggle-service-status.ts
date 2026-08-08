import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';
import { toast } from 'sonner';

export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Estado del servicio actualizado');
    },
    onError: () => {
      toast.error('Ocurrió un error al actualizar el estado del servicio');
    }
  });
};
