import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { servicesApi } from '../api/services-api';
import { canKeepServiceResults } from '../utils/services-page-model';
import type { GetAllServicesParams } from '../types/services.types';

export const useServices = (params?: GetAllServicesParams, enabled = true) => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['services', tenantId, params],
    enabled: !!tenantId && enabled,
    queryFn: ({ signal }) => servicesApi.getAll(params, { signal, tenantId }),
    placeholderData: (previousData, previousQuery) =>
      previousQuery && canKeepServiceResults(tenantId, params, previousQuery.queryKey) ? previousData : undefined,
  });
};
