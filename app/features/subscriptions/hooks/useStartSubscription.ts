import { useMutation } from '@tanstack/react-query';
import { subscriptionsApi } from '../api/subscriptions-api';
import { useNavigate, useParams } from 'react-router';

export const useStartSubscription = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const { mutate: selectPlan, isPending } = useMutation({
    mutationFn: async (planId: string) => {
      await subscriptionsApi.createSubscription({
        planId,
        tenantId,
      });
    },
    onSuccess: () => {
      navigate(`/onboarding/${tenantId}/address`);
    },
  });

  return { selectPlan, isPending };
};
