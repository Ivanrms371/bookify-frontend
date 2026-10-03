import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { billingApi } from '../api/billing-api';
import { getExpectedCheckout, isCheckoutConfirmed } from '../utils/checkout-confirmation';

type ReturnState = 'invalid' | 'confirmed' | 'error' | 'pending' | 'confirming';

export function useCheckoutReturn() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const selection = getExpectedCheckout(params.get('plan'), params.get('cycle'));
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const client = useQueryClient();
  const [attempt, setAttempt] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const contextReady = Boolean(tenant?.id && tenant.slug === slug && selection);
  const query = useQuery({
    queryKey: ['billing', tenant?.id, 'checkout-return', selection?.planId, selection?.cycle, attempt],
    queryFn: billingApi.getCurrentSubscription,
    enabled: contextReady && !timedOut,
    staleTime: 0, retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false,
    refetchInterval: (query) => timedOut || query.state.error || (selection && query.state.data && isCheckoutConfirmed(query.state.data, selection)) ? false : 2_000,
  });
  const confirmed = Boolean(selection && query.data && isCheckoutConfirmed(query.data, selection));
  useEffect(() => {
    setTimedOut(false);
    if (!contextReady) return;
    const timer = window.setTimeout(() => setTimedOut(true), 30_000);
    return () => window.clearTimeout(timer);
  }, [attempt, tenant?.id, slug, params.toString(), contextReady]);
  useEffect(() => {
    if (!confirmed || useAuthStore.getState().session?.activeTenant?.id !== tenant?.id) return;
    void client.invalidateQueries({ queryKey: ['billing', tenant?.id, 'current'] });
    void client.invalidateQueries({ queryKey: ['billing', tenant?.id, 'access'] });
    void client.invalidateQueries({ queryKey: ['billing', tenant?.id, 'payments'] });
  }, [confirmed, client, tenant?.id]);
  return {
    state: (!selection ? 'invalid' : confirmed ? 'confirmed' : query.isError ? 'error' : timedOut ? 'pending' : 'confirming') as ReturnState,
    retry: () => { setTimedOut(false); setAttempt((value) => value + 1); },
  };
}
