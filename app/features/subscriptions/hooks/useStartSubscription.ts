import { useMutation } from '@tanstack/react-query';
import { subscriptionsService } from '../services/subscriptions.service';
import { useNavigate, useParams } from 'react-router';

export const useStartSubscription = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const { mutate: selectPlan, isPending } = useMutation({
    mutationFn: async (planId: string) => {
      await subscriptionsService.createSubscription({
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
