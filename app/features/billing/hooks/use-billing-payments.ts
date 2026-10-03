import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';
import type { PaymentPagination } from '../types/payment.types';

export function useBillingPayments(pagination: PaymentPagination) {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'payments', pagination.page, pagination.pageSize],
    queryFn: ({ signal }) => billingApi.getPayments(pagination, signal),
    enabled: Boolean(tenant?.id && tenant.slug === slug),
    staleTime: 30_000,
    retry: false,
  });
}

export function usePaymentInvoice() {
  const { slug } = useParams();
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useMutation({
    gcTime: 0,
    retry: false,
    mutationFn: async (paymentId: string) => {
      const tenant = useAuthStore.getState().session?.activeTenant;
      if (!tenantId || tenant?.id !== tenantId || tenant.slug !== slug) {
        throw new Error('El negocio cambió. Vuelve a abrir su historial de pagos.');
      }
      const result = await billingApi.getInvoice(paymentId);
      const url = new URL(result.url);
      if (url.protocol !== 'https:' || url.hostname !== 'app.lemonsqueezy.com' || url.username || url.password || url.port) {
        throw new Error('No pudimos validar el enlace de la factura.');
      }
      if (useAuthStore.getState().session?.activeTenant?.id !== tenantId || window.location.pathname.split('/')[1] !== slug) {
        throw new Error('El negocio cambió. Vuelve a abrir su historial de pagos.');
      }
      return url.toString();
    },
  });
}
