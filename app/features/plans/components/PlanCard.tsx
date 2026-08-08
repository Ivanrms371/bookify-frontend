import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { CheckIcon } from '@heroicons/react/16/solid';
import { Heading, Text } from '@/shared/components/typography';
import type { Plan } from '../types/plans.type';
import { getMonthlyPrice, getPercentageSaving } from '../utils/plans.utils';
import { useStartSubscription } from '@/features/subscriptions';

interface Props {
  plan: Plan;
}

export function PlanCard({ plan }: Props) {
  const { id, name, description, features, billingCycle, isFeatured } = plan;
  const { selectPlan, isPending } = useStartSubscription();

  return (
    <div
      className={cn(
        'relative mx-auto flex w-full max-w-lg flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition dark:border-gray-800 dark:bg-gray-950 dark:shadow-none',
        isFeatured && 'border-indigo-500 shadow-md dark:border-indigo-500',
      )}
    >
      {isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold tracking-wide text-gray-50 uppercase">
          Más Popular
        </div>
      )}

      <div className="mb-6">
        {billingCycle === 'ANNUAL' && (
          <div className="flex justify-end">
            <span
              className={cn(
                'rounded-2xl  bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300',
                isFeatured && ' bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400',
              )}
            >
              {getPercentageSaving(plan)}
            </span>
          </div>
        )}
        <Heading as="h3" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {name}
        </Heading>
        <Text>{description}</Text>
      </div>

      <div className={`mb-6 ${isFeatured ? 'flex items-end gap-1' : ''}`}>
        <span className="text-5xl font-extrabold text-gray-800 dark:text-gray-200">${getMonthlyPrice(plan)}</span>
        <span className="font-medium text-gray-500 dark:text-gray-400">/mes</span>
      </div>

      <ul className="mb-8 flex grow flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div
              className={cn('shrink-0 rounded-full p-1', isFeatured ? 'bg-indigo-200 dark:bg-indigo-600' : 'bg-gray-100 dark:bg-gray-800')}
            >
              <CheckIcon
                className={cn('size-4', isFeatured ? 'text-indigo-600 dark:text-indigo-200' : 'text-gray-800 dark:text-gray-200')}
              />
            </div>
            <span className={'text-sm font-medium text-gray-700 dark:text-gray-500'}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={() => selectPlan(id)}
        disabled={isPending}
        className={isFeatured ? 'button-primary' : 'button-secondary'}
      >
        Seleccionar plan
      </Button>
    </div>
  );
}
