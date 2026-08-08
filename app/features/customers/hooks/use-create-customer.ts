import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customer-api';
import type { CustomerFormData } from '../schemas/customer-form.schema';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) => customerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
