import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/useAuthStore';
import { servicesService } from '../services/services.service';

export const useServices = () => {
  const tenantId = useAuthStore((s) => s.tenant?.id);

  return useQuery({
    queryKey: ['services', tenantId],
    queryFn: () => servicesService.getAll(tenantId!),
    enabled: !!tenantId,
  });
};
