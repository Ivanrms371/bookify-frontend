import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';
import { toast } from 'sonner';

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Servicio eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el servicio');
    },
  });
};
