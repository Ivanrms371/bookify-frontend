import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';
import type { CreateServicePayload } from '../types/services.types';
import { toast } from 'sonner';

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => servicesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
