import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customer-api';

export const useUnblockCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.unblock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
