import { Card } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  color?: 'indigo' | 'gray';
  className?: string;
}

export const StatsCard = ({ title, value, trend, color = 'indigo', className }: StatsCardProps) => {
  const isPositive = trend?.includes('+');

  return (
    <Card
      className={cn(
        'flex w-full justify-between px-3.5 py-4.5 sm:px-6 sm:py-6',
        'border-0 shadow-sm transition-all',
        color === 'indigo' && 'bg-indigo-500 text-white',
        color === 'gray' && 'bg-gray-900 text-white',
        className,
      )}
    >
      <div className="flex flex-col justify-between gap-2 sm:gap-4">
        <span className="text-sm font-medium text-white sm:text-base">{title}</span>
        <div className=" text-2xl font-bold tracking-tight min-[400px]:text-3xl sm:text-4xl">{value}</div>
      </div>

      {trend && (
        <div className="flex flex-col items-end justify-between gap-2 sm:gap-4">
          <div
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full backdrop-blur-md sm:size-8',
              isPositive ? 'bg-emerald-400/20' : 'bg-rose-400/20',
            )}
          >
            {isPositive ? (
              <ArrowTrendingUpIcon className="size-5 text-emerald-400 dark:text-emerald-300" />
            ) : (
              <ArrowTrendingDownIcon className="dark:text-rose-6500 size-5 text-rose-500" />
            )}
          </div>
          <span className={cn('text-xs font-medium sm:text-base', isPositive ? 'text-emerald-50 ' : 'text-rose-50')}>{trend}</span>
        </div>
      )}
    </Card>
  );
};
