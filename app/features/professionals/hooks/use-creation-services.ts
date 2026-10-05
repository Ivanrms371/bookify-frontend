import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { servicesApi } from '@/features/services/api/services-api';
import type { Service } from '@/features/services/types/services.types';

export function useCreationServices(tenantId: string) {
  return useQuery({
    queryKey: ['services', tenantId, 'professional-creation'],
    enabled: !!tenantId,
    queryFn: async ({ signal }) => {
      const services: Service[] = [];
      for (let skip = 0; ; skip += 24) {
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenantId) throw new Error('El espacio cambió.');
        const result = await servicesApi.getAll({ skip, take: 24, isActive: true, orderBy: 'name', order: 'asc' });
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenantId) throw new Error('El espacio cambió.');
        services.push(...result.data);
        if (result.data.length < 24) return services;
      }
    },
  });
}
