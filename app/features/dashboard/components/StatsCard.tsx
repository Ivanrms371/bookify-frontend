import { Card } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDescription?: string;
  color?: 'indigo' | 'gray';
  className?: string;
}

export const StatsCard = ({ title, value, trend, trendDescription, color = 'indigo', className }: StatsCardProps) => {
  const isPositive = trend?.includes('+') || trend?.includes('más') || trend?.startsWith('Igual') || trend?.startsWith('0');

  return (
    <Card
      className={cn(
        'flex w-full justify-between gap-2 px-3.5 py-4.5 sm:px-6 sm:py-6',
        'border-0 shadow-sm transition-all',
        color === 'indigo' && 'bg-indigo-500 text-white',
        color === 'gray' && 'bg-gray-900 text-white',
        className,
      )}
    >
      <div className="flex flex-col justify-between gap-2 sm:gap-4">
        <span className="text-sm font-medium text-white sm:text-base">{title}</span>
        <div className="font-display text-2xl font-bold tracking-tight min-[400px]:text-3xl sm:text-4xl">{value}</div>
      </div>

      {trend && (
        <div className="flex max-w-[50%] flex-col items-end justify-between gap-2 sm:gap-4">
          <div
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full sm:size-8',
              isPositive ? 'bg-green-800/50 text-green-100' : 'bg-red-800/50 text-red-100',
            )}
          >
            {isPositive ? <ArrowTrendingUpIcon className="size-5" /> : <ArrowTrendingDownIcon className="size-5" />}
          </div>
          <span
            title={trendDescription}
            aria-label={trendDescription ? `${trend} ${trendDescription}` : undefined}
            className={cn(
              'rounded-full px-2 py-0.5 text-center text-[10px] font-medium sm:text-xs',
              isPositive ? 'bg-green-800/50 text-green-100' : 'bg-red-800/50 text-red-100',
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </Card>
  );
};
