import { cn } from '@/shared/utils/cn';
import type { BillingCycle } from '../types/plans.type';
import { Switch } from '@/shared/components/form/Switch';

interface ToggleBillingCycleProps {
  billingCycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export const ToggleBillingCycle = ({ billingCycle, onChange }: ToggleBillingCycleProps) => {
  const isAnnual = billingCycle === 'ANNUAL';

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mensual</span>
      <Switch checked={isAnnual} onCheckedChange={(value) => onChange(value ? 'ANNUAL' : 'MONTHLY')} />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Anual</span>
    </div>
  );
};
