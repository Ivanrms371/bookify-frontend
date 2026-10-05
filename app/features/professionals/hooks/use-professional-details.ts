import { useAuthStore } from '@/core/auth/use-auth-store';
import { useQuery } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';
import type { ProfessionalWithDetails } from '../types/professional.types';

export const useProfessionalDetails = (id: string) => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery<ProfessionalWithDetails, Error>({
    queryKey: ['professional', tenantId, id, 'details'],
    queryFn: () => professionalApi.getByIdWithDetails(id),
    enabled: !!tenantId && !!id,
  });
};
