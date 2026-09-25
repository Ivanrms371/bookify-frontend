import { cn } from '@/shared/utils';
import { Heading, Text } from '@/shared/components/typography';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Button } from '@/shared/components/ui';
import { PLANS } from '../../data/plans';
import { PlanCard } from './plan-card';

interface Props {
  isAnnual: boolean;
}

export const PlanGrid = ({ isAnnual }: Props) => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-4">
      {PLANS.map((plan) => {
        return <PlanCard plan={plan} isAnnual={isAnnual} />;
      })}
    </div>
  );
};
