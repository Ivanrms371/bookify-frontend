import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { professionalApi } from '../api/professional-api';
import type { ProfessionalBasic } from '../types/professional.types';

export function useCalendarProfessionals() {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: ['professionals', 'calendar', tenantId],
    queryFn: async () => {
      const professionals: ProfessionalBasic[] = [];
      const take = 24;
      let page: ProfessionalBasic[];
      do {
        page = await professionalApi.getAll({ skip: professionals.length, take });
        professionals.push(...page);
      } while (page.length === take);
      return professionals.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    },
  });
}
