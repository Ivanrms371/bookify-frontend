import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';

export function useCustomerPortal() {
  const { slug } = useParams();
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useMutation({
    gcTime: 0,
    retry: false,
    mutationFn: async () => {
      const tenant = useAuthStore.getState().session?.activeTenant;
      if (!tenantId || tenant?.id !== tenantId || tenant.slug !== slug) {
        throw new Error('El negocio cambió. Vuelve a abrir su página de facturación.');
      }
      const result = await billingApi.getCustomerPortal();
      const url = new URL(result.url);
      const isLemonHost = url.hostname === 'lemonsqueezy.com' || url.hostname.endsWith('.lemonsqueezy.com');
      if (url.protocol !== 'https:' || !isLemonHost || url.username || url.password || url.port) {
        throw new Error('No pudimos validar el enlace de gestión.');
      }
      if (useAuthStore.getState().session?.activeTenant?.id !== tenantId || window.location.pathname.split('/')[1] !== slug) {
        throw new Error('El negocio cambió. Vuelve a abrir su página de facturación.');
      }
      return url.toString();
    },
  });
}

export function useBillingReturnRefresh() {
  const { slug } = useParams();
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  const client = useQueryClient();
  useEffect(() => {
    const refresh = () => {
      const tenant = useAuthStore.getState().session?.activeTenant;
      if (document.visibilityState !== 'visible' || !tenantId || tenant?.id !== tenantId || tenant.slug !== slug) return;
      if (window.location.pathname.split('/')[1] !== slug) return;
      for (const resource of ['current', 'access', 'payments']) {
        void client.invalidateQueries({ queryKey: ['billing', tenantId, resource] });
      }
    };
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [client, tenantId, slug]);
}
