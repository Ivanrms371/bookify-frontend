import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customer-api';
import type { GetAllCustomersParams } from '../types/customer-types';

export const useCustomers = (params?: GetAllCustomersParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerApi.getAll(params),
  });
};
