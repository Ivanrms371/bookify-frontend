import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';
import type { PlanChangeAction, PlanChangeSelection } from '../types/plan-change.types';

export function useChangeEligibility(selection: PlanChangeSelection, canManage: boolean) {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'change-eligibility', selection.planId, selection.cycle],
    queryFn: ({ signal }) => billingApi.getChangeEligibility(selection, signal, tenant?.id),
    enabled: Boolean(canManage && tenant?.id && tenant.slug === slug),
    staleTime: 0,
    retry: false,
  });
}
export function usePlanChange() {
  const { slug } = useParams();
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  const queries = useQueryClient();
  const checkTenant = () => {
    const current = useAuthStore.getState().session?.activeTenant;
    if (!tenantId || current?.id !== tenantId || current.slug !== slug || window.location.pathname.split('/')[1] !== slug) {
      throw new Error('El negocio cambió. Vuelve a seleccionar el plan.');
    }
  };
  return useMutation({
    gcTime: 0,
    retry: false,
    mutationFn: async (request: PlanChangeAction) => {
      checkTenant();
      const result =
        request.action === 'cancel'
          ? await billingApi.cancelPlanChange(tenantId)
          : request.action === 'refresh'
            ? await billingApi.refreshPlanChange(tenantId)
            : await billingApi.changePlan(request.selection, tenantId);
      checkTenant();
      return result;
    },
    onSettled: () => {
      for (const key of [
        ['billing', tenantId],
        ['services', tenantId],
        ['professionals', tenantId],
      ]) {
        void queries.invalidateQueries({ queryKey: key });
      }
    },
  });
}
