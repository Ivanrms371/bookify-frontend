import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { customerApi } from '../api/customer-api';
import { canKeepCustomerResults } from '../utils/customers-page-model';
import type { GetAllCustomersParams } from '../types/customer-types';

export const useCustomers = (params?: GetAllCustomersParams) => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['customers', tenantId, params],
    enabled: !!tenantId,
    queryFn: ({ signal }) => customerApi.getAll(params, { signal, tenantId }),
    placeholderData: (previousData, previousQuery) =>
      previousQuery && canKeepCustomerResults(tenantId, params, previousQuery.queryKey) ? previousData : undefined,
  });
};
