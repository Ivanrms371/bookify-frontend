import type { ReactElement } from 'react';
import { BillingShell } from '@/features/billing';
import { Plans } from '@/features/billing/components/plans/plans';

const BillingPage = (): ReactElement => {
  return (
    <BillingShell>
      <Plans />
    </BillingShell>
  );
};

export default BillingPage;
