import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';

export function useBillingSummary() {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'current'],
    queryFn: billingApi.getCurrentSubscription,
    enabled: Boolean(tenant?.id && tenant.slug === slug),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useSubscriptionAccess() {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'access'],
    queryFn: billingApi.getAccess,
    enabled: Boolean(tenant?.id && tenant.slug === slug),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
