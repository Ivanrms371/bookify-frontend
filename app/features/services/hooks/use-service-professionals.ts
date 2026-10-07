import { useAuthStore } from '@/core/auth/use-auth-store';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';

export const useServiceProfessionals = (serviceId: string | null, enabled = true) => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['services', tenantId, serviceId, 'professionals'],
    queryFn: () => servicesApi.getAllProfessionals(serviceId!),
    enabled: enabled && !!tenantId && !!serviceId,
  });
};
