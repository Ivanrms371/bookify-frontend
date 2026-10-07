import { can } from '@/core/auth/permissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';
import { professionalApi } from '../api/professional-api';

export function useDeleteProfessional(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (id: string) => {
      const tenant = useAuthStore.getState().session?.activeTenant;
      if (tenant?.id !== tenantId || !can(tenant, 'professional:delete') || window.location.pathname.split('/')[1] !== tenant.slug) {
        throw new ApiError('El espacio seleccionado cambió. Volvé a abrir el formulario.');
      }
      return professionalApi.delete(id, tenantId);
    },
    onSuccess: () => {
      void queries.invalidateQueries({ queryKey: ['reports'] });
      // Refreshing cannot turn a committed deletion into a failed submission.
      for (const key of ['professionals', 'professional', 'services', 'billing']) {
        void queries.invalidateQueries({ queryKey: [key, tenantId] });
      }
      void queries.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}
