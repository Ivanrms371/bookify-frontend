import { can } from '@/core/auth/permissions';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';
import { updateProfessionalSchema, type UpdateProfessionalValues } from '../schemas/update-professional-schema';
import { ApiError } from '@/core/error/api-error';

export const useUpdateProfessional = (id: string, tenantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationFn: (data: UpdateProfessionalValues) => {
      const tenant = useAuthStore.getState().session?.activeTenant;
      if (tenant?.id !== tenantId || !can(tenant, 'professional:update') || window.location.pathname.split('/')[1] !== tenant.slug)
        throw new ApiError('El espacio seleccionado cambió. Volvé a abrir el formulario.');
      return professionalApi.update(id, updateProfessionalSchema.parse(data), tenantId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      // Invalidate both the list and the specific details queries
      queryClient.invalidateQueries({ queryKey: ['professionals', tenantId] });
      void queryClient.invalidateQueries({ queryKey: ['professional', tenantId] });
      void queryClient.invalidateQueries({ queryKey: ['services', tenantId] });
      void queryClient.invalidateQueries({ queryKey: ['billing', tenantId] });
    },
  });
};
