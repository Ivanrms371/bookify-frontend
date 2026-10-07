import { useAuthStore } from '@/core/auth/use-auth-store';
import { useQuery } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';

export const useProfessionals = () => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['professionals', tenantId],
    enabled: !!tenantId,
    queryFn: ({ signal }) => professionalApi.getAll(undefined, { tenantId, signal }),
  });
};
