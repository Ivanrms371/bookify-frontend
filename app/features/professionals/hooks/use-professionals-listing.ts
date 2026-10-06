import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { professionalApi } from '../api/professional-api';
import { canKeepProfessionalResults } from '../utils/professionals-page-model';
import type { GetProfessionalsParams } from '../types/professional.types';

export function useProfessionalsListing(params: GetProfessionalsParams) {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['professionals', tenantId, params],
    enabled: !!tenantId,
    queryFn: ({ signal }) => professionalApi.getListing(params, { signal, tenantId }),
    placeholderData: (previousData, previousQuery) =>
      previousQuery && canKeepProfessionalResults(tenantId, params, previousQuery.queryKey) ? previousData : undefined,
  });
}
