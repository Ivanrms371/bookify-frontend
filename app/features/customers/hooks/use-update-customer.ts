import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customer-api';
import type { CustomerFormData } from '../schemas/customer-form.schema';

interface UpdateCustomerParams {
  id: string;
  data: CustomerFormData;
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateCustomerParams) => customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
