import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';
import type { CreateServicePayload, UpdateServicePayload } from '../types/services.types';

interface UpdateServiceParams {
  id: string;
  data: UpdateServicePayload;
}

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateServiceParams) => servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
