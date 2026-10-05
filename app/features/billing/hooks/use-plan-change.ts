import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';
import type { CheckoutSelection } from '../types/billing.types';
import type { PlanChangeAction } from '../types/plan-change.types';

export function useChangeEligibility(selection: CheckoutSelection, canManage: boolean) {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'change-eligibility', selection.planId, selection.cycle],
    queryFn: ({ signal }) => billingApi.getChangeEligibility(selection, signal),
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
          ? await billingApi.cancelPlanChange()
          : request.action === 'refresh'
            ? await billingApi.refreshPlanChange()
            : await billingApi.changePlan(request.selection);
      checkTenant();
      return result;
    },
    onSettled: async () => {
      await queries.invalidateQueries({ queryKey: ['billing', tenantId] });
    },
  });
}
