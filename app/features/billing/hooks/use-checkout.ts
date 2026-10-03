import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';
import type { CheckoutSelection } from '../types/billing.types';

export function usePlanEligibility(selection: CheckoutSelection | null, canManage: boolean) {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'eligibility', selection?.planId, selection?.cycle],
    queryFn: () => billingApi.getEligibility(selection!),
    enabled: Boolean(selection && canManage && tenant?.id && tenant.slug === slug), staleTime: 0,
  });
}

export function useCheckout() {
  const { slug } = useParams();
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useMutation({
    mutationFn: async (selection: CheckoutSelection) => {
      const current = useAuthStore.getState().session?.activeTenant;
      if (!tenantId || current?.id !== tenantId || current.slug !== slug) throw new Error('El negocio cambió. Vuelve a seleccionar el plan.');
      const result = await billingApi.createCheckout(selection);
      const url = new URL(result.url);
      if (url.protocol !== 'https:' || !url.hostname.endsWith('.lemonsqueezy.com')) throw new Error('No pudimos validar el enlace de pago.');
      if (useAuthStore.getState().session?.activeTenant?.id !== tenantId || window.location.pathname.split('/')[1] !== slug) throw new Error('El negocio cambió. Vuelve a seleccionar el plan.');
      window.location.assign(url.toString());
    },
  });
}
