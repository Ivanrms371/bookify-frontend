import { useEffect, useState } from 'react';
import type { SubscriptionAccess } from '../types/billing.types';
import { getSubscriptionNotice } from '../utils/subscription-notice';

export function useSubscriptionNotice(access?: SubscriptionAccess) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return access ? getSubscriptionNotice(access, now) : null;
}
