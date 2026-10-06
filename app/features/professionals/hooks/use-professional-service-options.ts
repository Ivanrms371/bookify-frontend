import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { servicesApi } from '@/features/services/api/services-api';
import { PROFESSIONALS_PAGE_SIZE } from '../utils/professionals-page-model';

export function useProfessionalServiceOptions() {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['services', tenantId, 'professional-filter'],
    enabled: !!tenantId,
    staleTime: 60_000,
    queryFn: async ({ signal }) => {
      const services: { id: string; name: string }[] = [];
      let total: number | undefined;
      for (let skip = 0; ; skip += PROFESSIONALS_PAGE_SIZE) {
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenantId) throw new Error('El espacio cambió.');
        const result = await servicesApi.getAll(
          { skip, take: PROFESSIONALS_PAGE_SIZE, count: skip === 0, orderBy: 'name', order: 'asc' },
          { signal, tenantId },
        );
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenantId) throw new Error('El espacio cambió.');
        if (skip === 0) total = result.meta.total;
        services.push(...result.data.map(({ id, name }) => ({ id, name })));
        if (result.data.length < PROFESSIONALS_PAGE_SIZE || (total !== undefined && services.length >= total)) {
          return services;
        }
      }
    },
  });
}
