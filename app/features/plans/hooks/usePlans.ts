import { useState } from 'react';
import type { BillingCycle } from '../types/plans.type';
import { plansApi } from '../api/plans-api';
import { useQuery } from '@tanstack/react-query';

export const usePlans = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: plansApi.getPlans,
  });

  const filteredPlans = plans.filter((plan) => plan.billingCycle === billingCycle || plan.billingCycle === null);

  return { plans: filteredPlans, isLoading, billingCycle, setBillingCycle };
};
