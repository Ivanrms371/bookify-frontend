import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid';
import type { Plan } from '../../types/billing.types';

interface Props {
  plan: Plan;
  isAnnual: boolean;
  isCurrent?: boolean;
  canManage: boolean;
  pending: boolean;
  onSelect: () => void;
}

export const PlanCard = ({ plan, isAnnual, isCurrent, canManage, pending, onSelect }: Props): React.JSX.Element => {
  const { isPopular, description, features, pricing, title, cta } = plan;

  const available = plan.availability[isAnnual ? 'ANNUAL' : 'MONTHLY'];
  const disabledReason = !canManage
    ? 'Solo el propietario puede gestionar la suscripción'
    : plan.id === 'free'
      ? 'Selección de Free pendiente'
      : !available
        ? 'Ciclo de pago no disponible'
        : undefined;

  const annual = isAnnual && pricing.ANNUAL;
  const displayPrice = Number(annual ? (annual.equivalentMonthlyAmount ?? Number(annual.amount) / 12) : pricing.MONTHLY.amount).toFixed(2);

  const comparePrice = isAnnual ? (pricing.ANNUAL?.compareAtAmount ?? null) : null;

  const savingsPercentage =
    isAnnual && comparePrice && pricing.ANNUAL?.amount
      ? Math.round(((Number(comparePrice) - Number(pricing.ANNUAL.amount)) / Number(comparePrice)) * 100)
      : 0;

  const hasDiscount = savingsPercentage > 0 && comparePrice !== null;

  return (
    <div
      className={cn(
        'relative flex flex-col  rounded-3xl border border-gray-200 bg-white py-12 px-10 transition-all',
        isPopular && 'border-gray-900 bg-gray-900 shadow-xl',
        isCurrent && 'border-2 border-indigo-500',
      )}
    >
      {isCurrent && <div className="absolute bg-indigo-500 text-white font-medium text-sm py-1 px-2 -top-4 rounded-lg">Tu plan actual</div>}
      <div>
        <Heading as="h3" className={cn('mb-6 text-left font-bold text-3xl', isPopular && 'text-gray-50')}>
          {title}
        </Heading>

        {isAnnual && hasDiscount && (
          <Text
            size="xs"
            as="span"
            className={cn(
              'absolute top-7 right-7 rounded-full bg-indigo-100 px-2.5 py-1 font-semibold text-indigo-600',
              isPopular && 'border border-indigo-700/50 bg-indigo-900/60 text-indigo-200',
            )}
          >
            Ahorra {savingsPercentage}%
          </Text>
        )}

        <div className="mb-8">
          {isAnnual && (
            <>
              {hasDiscount ? (
                <div className="relative flex w-fit items-center gap-1 h-8">
                  <span className={cn('text-sm font-display font-medium text-gray-400', isPopular && 'text-gray-500')}>$</span>

                  <span className={cn('text-lg font-display font-medium text-gray-400', isPopular && 'text-gray-500')}>
                    {(Number(comparePrice) / 12).toFixed(2)}
                  </span>

                  <span className={cn('text-xs text-gray-400', isPopular && 'text-gray-500')}>/mes</span>

                  <div className={cn('absolute w-full border-t border-gray-400', isPopular && 'border-gray-600')} />
                </div>
              ) : (
                <div className="h-8"></div>
              )}
            </>
          )}

          <div className="mb-2 flex items-end gap-1">
            <span className={cn('text-2xl font-display font-medium text-gray-800', isPopular && 'text-gray-100')}>$</span>

            <span className={cn('text-6xl font-display leading-12 font-bold text-gray-800', isPopular && 'text-gray-100')}>
              {displayPrice}
            </span>

            <span className={cn('text-base font-medium text-gray-600', isPopular && 'text-gray-300')}>/mes</span>
          </div>

          <p className={cn('text-left text-sm text-gray-600', isPopular && 'text-gray-300')}>{description}</p>
        </div>

        {annual && (
          <p className={cn('mb-3 text-sm text-gray-500', isPopular && 'text-gray-300')}>
            {annual.amount} {plan.currency} al año
          </p>
        )}
        <Button
          disabled={pending || Boolean(disabledReason)}
          title={disabledReason}
          onClick={onSelect}
          size="md"
          variant={isPopular ? 'primary' : 'secondary'}
          fullWidth
        >
          {isCurrent ? 'Elegir este plan' : cta}
          <ArrowRightIcon className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>

        {disabledReason && <p className={cn('mt-2 text-xs text-gray-500', isPopular && 'text-gray-300')}>{disabledReason}</p>}
        <div className={cn('border-b border-gray-200 my-6', isPopular && 'border-gray-700')}></div>
      </div>

      <ul className={cn('space-y-3.5 text-left', isPopular && 'border-gray-700')}>
        {features.map((feature) => (
          <li key={feature} className={cn('flex items-center text-sm text-gray-700', isPopular && 'text-gray-200')}>
            <CheckIcon
              className={cn(
                'mr-2.5 size-5 shrink-0 rounded-full bg-indigo-100/70 p-0.5 text-indigo-600',
                isPopular && 'bg-gray-800 text-indigo-400',
              )}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
