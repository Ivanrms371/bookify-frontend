import { useState } from 'react';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Button } from '@/shared/components/ui';
import { Heading, Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { PLANS, type BillingCycle, type MarketingPlan, type WorkspaceType } from '../data/plans';
import { useStartSubscription } from '@/features/subscriptions';

interface PlanSelectionProps {
  workspaceType: WorkspaceType; // 'INDIVIDUAL' | 'TEAM'
}

export function PlanSelection({ workspaceType }: PlanSelectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);
  const currentCycle: BillingCycle = isAnnual ? 'ANNUAL' : 'MONTHLY';
  const { selectPlan, isPending } = useStartSubscription();

  const displayedPlans: MarketingPlan[] = Object.values(PLANS)
    .filter((plan) => plan.compatibleWorkspaces.includes(workspaceType))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const isSingle = displayedPlans.length === 1;

  return (
    <div className="flex  w-full flex-col items-center">
      {/* Switch Mensual / Anual */}
      <div className="relative mb-10 flex w-72 gap-4 rounded-full border border-gray-100 bg-white p-1 shadow-sm">
        <button
          onClick={() => setIsAnnual(false)}
          className="z-10 flex w-full flex-1 cursor-pointer items-center justify-center rounded-full bg-transparent py-2 text-sm font-medium text-gray-800 transition-colors duration-300"
          type="button"
        >
          Mensual
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className="z-10 flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-transparent py-2 text-sm font-medium text-gray-800 transition-colors duration-300"
          type="button"
        >
          Anual
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">-20%</span>
        </button>
        <span
          className={cn(
            'absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full border border-gray-300 bg-gray-100 transition-transform duration-300 ease-in-out',
            isAnnual && 'translate-x-full',
          )}
        />
      </div>

      {/* Contenedor Flex: 1 col en mobile, en desktop divide el espacio equitativamente */}
      <div className={cn(' w-full flex justify-center md:flex-row gap-6 items-stretch')}>
        {displayedPlans.map((plan) => {
          const pricingData = currentCycle === 'ANNUAL' && plan.pricing.ANNUAL ? plan.pricing.ANNUAL : plan.pricing.MONTHLY;

          const displayPrice =
            currentCycle === 'ANNUAL' && pricingData.equivalentMonthlyPrice != null
              ? pricingData.equivalentMonthlyPrice
              : pricingData.price;

          const comparePrice = pricingData.compareAtPrice;
          const isFeaturedCard = plan.isPopular || isSingle;

          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-1 flex-col justify-between rounded-3xl border border-gray-300 bg-gray-100 p-7 transition-all max-w-lg',
                isFeaturedCard && 'border-gray-900 bg-gray-900 shadow-xl',
              )}
            >
              <div>
                <Heading as="h3" className={cn('mb-6 text-left font-bold text-2xl md:text-3xl', isFeaturedCard && 'text-gray-50')}>
                  {plan.title}
                </Heading>

                {/* Badge de Ahorro */}
                {currentCycle === 'ANNUAL' && comparePrice && (
                  <Text
                    className={cn(
                      'absolute top-7 right-7 rounded-full bg-indigo-100 px-2.5 py-1 font-semibold text-xs text-indigo-600',
                      isFeaturedCard && 'border border-indigo-700/50 bg-indigo-900/60 text-indigo-200',
                    )}
                  >
                    Ahorra {Math.round(((comparePrice - pricingData.price) / comparePrice) * 100)}%
                  </Text>
                )}

                <div className="mb-8">
                  {currentCycle === 'ANNUAL' && (
                    <>
                      {comparePrice ? (
                        <div className="relative mb-1 flex w-fit items-center gap-1">
                          <span className={cn('text-sm text-gray-400', isFeaturedCard && 'text-gray-500')}>$</span>
                          <span className={cn('text-lg font-semibold text-gray-400', isFeaturedCard && 'text-gray-500')}>
                            {(comparePrice / 12).toFixed(2)}
                          </span>
                          <span className={cn('text-xs text-gray-400', isFeaturedCard && 'text-gray-500')}>/mes</span>
                          <div className={cn('absolute w-full border-t border-gray-400', isFeaturedCard && 'border-gray-600')} />
                        </div>
                      ) : (
                        <div className="h-8" />
                      )}
                    </>
                  )}

                  {/* Precio mensual */}
                  <div className="mb-2 flex items-end gap-1">
                    <span className={cn('text-2xl font-medium text-gray-800', isFeaturedCard && 'text-gray-100')}>$</span>
                    <span className={cn('text-6xl font-semibold leading-none text-gray-800', isFeaturedCard && 'text-gray-100')}>
                      {displayPrice}
                    </span>
                    <span className={cn('text-base text-gray-600', isFeaturedCard && 'text-gray-300')}>/mes</span>
                  </div>

                  <p className={cn('text-left text-sm text-gray-600', isFeaturedCard && 'text-gray-300')}>{plan.description}</p>
                </div>

                <div className={cn('mb-6 border-b border-gray-200 pb-6', isFeaturedCard && 'border-gray-700')}>
                  <Button
                    size="lg"
                    disabled={isPending}
                    variant={isFeaturedCard ? 'primary' : 'secondary'}
                    className="rounded-full"
                    fullWidth
                    onClick={() => selectPlan(plan.id)}
                  >
                    {plan.cta}
                    <ArrowRightIcon className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 pt-2 text-left flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className={cn('flex items-center text-sm text-gray-700', isFeaturedCard && 'text-gray-200')}>
                    <CheckIcon
                      className={cn(
                        'mr-2.5 size-5 shrink-0 rounded-full bg-indigo-100/70 p-0.5 text-indigo-600',
                        isFeaturedCard && 'bg-gray-800 text-indigo-400',
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
