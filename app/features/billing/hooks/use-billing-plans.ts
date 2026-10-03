import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';

export function useBillingPlans() {
  const { slug } = useParams();
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return useQuery({
    queryKey: ['billing', tenant?.id, 'plans'], queryFn: billingApi.getPlans,
    enabled: Boolean(tenant?.id && tenant.slug === slug), staleTime: 60_000,
  });
}
