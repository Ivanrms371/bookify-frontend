import { CheckoutReturnStatus } from '@/features/billing/components/checkout-return-status';
import { useCheckoutReturn } from '@/features/billing/hooks/use-checkout-return';

export default function BillingReturnPage() {
  const { state, retry } = useCheckoutReturn();
  return <CheckoutReturnStatus state={state} onRetry={retry} />;
}
