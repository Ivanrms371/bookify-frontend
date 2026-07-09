import { Card } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { QuotaItem } from '../types/quota.types';
import { Text } from '@/shared/components/typography';
import { useEffect, useState } from 'react';

interface QuotaCardProps {
  title: string;
  quota: QuotaItem;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  color?: string;
}

export const QuotaCard = ({ title, quota, icon: Icon }: QuotaCardProps) => {
  const { count, limit, percentage: quotaPercentage } = quota;
  const isUnlimited = limit === -1;
  const displayLimit = isUnlimited ? '∞' : limit;
  const remaining = isUnlimited ? '∞' : limit - count;

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setPercentage(quotaPercentage);
  }, [quotaPercentage]);

  return (
    <Card className="flex flex-col gap-4 px-3.5 py-4.5 sm:p-6">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-3">
          <div className={cn('hidden rounded-full bg-mist-100 p-3 shadow-sm sm:block dark:bg-mist-900')}>
            <Icon className={cn('size-5 text-mist-500 dark:text-mist-400')} />
          </div>
          <span className="text-sm font-semibold text-mist-800 sm:text-base dark:text-mist-200">{title}</span>
        </div>
        {!isUnlimited ? (
          remaining === 0 ? (
            <Text className="text-right text-xs font-medium text-red-500 dark:text-red-400">Limite alcanzado</Text>
          ) : (
            <Text className="text-right text-xs font-medium text-mist-500 dark:text-mist-400">Quedan {remaining}</Text>
          )
        ) : (
          <Text className="text-right text-xs font-medium text-mist-500 dark:text-mist-400">Ilimitado</Text>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <div className="font-mono text-base leading-3 font-bold text-mist-900 tabular-nums sm:text-2xl sm:leading-5 dark:text-mist-100">
              {count}
            </div>
            <div className="text-sm leading-3 font-medium text-mist-400 sm:text-base sm:leading-5 dark:text-mist-500">
              / <span className="text-lg">{displayLimit}</span>
            </div>
          </div>
          {!isUnlimited && (
            <Text
              className={cn(
                'text-xs font-semibold',
                percentage > 60 && percentage < 85 && 'text-yellow-400 dark:text-yellow-500',
                percentage > 85 && 'text-red-400 dark:text-red-500',
              )}
            >
              {Math.round(percentage)}%
            </Text>
          )}
        </div>

        <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full">
          <div
            className={cn(
              'h-full rounded-md bg-mist-800 transition-all duration-1000 ease-out dark:bg-mist-100',
              percentage > 60 && percentage < 85 && 'bg-yellow-400 dark:bg-yellow-600',
              percentage > 85 && 'bg-red-400 dark:bg-red-600',
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          <div className="h-full flex-1 rounded-md bg-mist-200 transition-all duration-200 ease-out dark:bg-mist-900" />
        </div>
      </div>
    </Card>
  );
};
