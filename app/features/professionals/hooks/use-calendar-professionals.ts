import { can } from '@/core/auth/permissions';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { professionalApi } from '../api/professional-api';
import type { ProfessionalBasic } from '../types/professional.types';

export function useCalendarProfessionals() {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const tenantId = tenant?.id;
  return useQuery({
    queryKey: ['professionals', tenantId, 'calendar'],
    enabled: !!tenantId && can(tenant, 'appointment:read_others'),
    queryFn: async ({ signal }) => {
      const professionals: ProfessionalBasic[] = [];
      const take = 24;
      let page: ProfessionalBasic[];
      do {
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenantId) throw new Error('El espacio cambió.');
        page = await professionalApi.getAll({ skip: professionals.length, take });
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenantId) throw new Error('El espacio cambió.');
        professionals.push(...page);
      } while (page.length === take);
      return professionals.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    },
  });
}
