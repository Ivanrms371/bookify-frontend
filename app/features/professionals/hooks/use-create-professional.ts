import { can } from '@/core/auth/permissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';
import { professionalApi } from '../api/professional-api';
import type { CreateProfessionalValues } from '../schemas/create-professional-schema';

export function useCreateProfessional(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (values: CreateProfessionalValues) => {
      const tenant = useAuthStore.getState().session?.activeTenant;
      if (tenant?.id !== tenantId || !can(tenant, 'professional:create') || window.location.pathname.split('/')[1] !== tenant.slug) {
        throw new ApiError('El espacio seleccionado cambió. Volvé a abrir el formulario.');
      }
      return professionalApi.create(values, tenantId);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'PLAN_LIMIT_REACHED') {
        void queries.invalidateQueries({ queryKey: ['billing', tenantId] });
        void queries.invalidateQueries({ queryKey: ['professionals', tenantId] });
      }
    },
    onSuccess: () => {
      void queries.invalidateQueries({ queryKey: ['reports'] });
      // Refresh errors must never turn a committed creation into a failed submission.
      void queries.invalidateQueries({ queryKey: ['professionals', tenantId] });
      void queries.invalidateQueries({ queryKey: ['professional', tenantId] });
      void queries.invalidateQueries({ queryKey: ['services', tenantId] });
      void queries.invalidateQueries({ queryKey: ['billing', tenantId] });
    },
  });
}
