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
        'relative mx-auto flex w-full max-w-lg flex-col rounded-3xl border border-mist-200 bg-white p-8 shadow-sm transition dark:border-mist-800 dark:bg-mist-950 dark:shadow-none',
        isFeatured && 'border-indigo-500 shadow-md dark:border-indigo-500',
      )}
    >
      {isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold tracking-wide text-mist-50 uppercase">
          Más Popular
        </div>
      )}

      <div className="mb-6">
        {billingCycle === 'ANNUAL' && (
          <div className="flex justify-end">
            <span
              className={cn(
                'rounded-2xl  bg-mist-100 px-3 py-1.5 text-xs font-semibold text-mist-700 dark:bg-mist-900 dark:text-mist-300',
                isFeatured && ' bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400',
              )}
            >
              {getPercentageSaving(plan)}
            </span>
          </div>
        )}
        <Heading as="h3" className="text-3xl font-bold text-mist-900 dark:text-mist-100">
          {name}
        </Heading>
        <Text>{description}</Text>
      </div>

      <div className={`mb-6 ${isFeatured ? 'flex items-end gap-1' : ''}`}>
        <span className="text-5xl font-extrabold text-mist-800 dark:text-mist-200">${getMonthlyPrice(plan)}</span>
        <span className="font-medium text-mist-500 dark:text-mist-400">/mes</span>
      </div>

      <ul className="mb-8 flex grow flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div
              className={cn('shrink-0 rounded-full p-1', isFeatured ? 'bg-indigo-200 dark:bg-indigo-600' : 'bg-mist-100 dark:bg-mist-800')}
            >
              <CheckIcon
                className={cn('size-4', isFeatured ? 'text-indigo-600 dark:text-indigo-200' : 'text-mist-800 dark:text-mist-200')}
              />
            </div>
            <span className={'text-sm font-medium text-mist-700 dark:text-mist-500'}>{feature}</span>
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
