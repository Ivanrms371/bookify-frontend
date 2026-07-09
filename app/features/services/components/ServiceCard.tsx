import { ClockIcon, EllipsisHorizontalIcon, PhotoIcon, TagIcon } from '@heroicons/react/24/outline';
import { Card } from '@/shared/components/ui';
import { Heading, Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { formatDurationMinutesSmall } from '../constants/service-duration';
import type { Service } from '../types/services.types';
import { formatServicePrice } from '../utils/format-service';

type ServiceCardProps = {
  service: Service;
  className?: string;
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  const { name, image, description, durationMinutes, price, discountPercentage, discountFixed } = service;
  const hasDiscount = discountPercentage > 0 || discountFixed > 0;

  return (
    <Card
      className={cn(
        'flex items-center gap-3 p-4',
        'transition-all duration-200 hover:border-indigo-200/60 hover:shadow-md dark:hover:border-indigo-800/40 relative',
        className,
      )}
    >
      <div className="shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="size-20 rounded-2xl border border-mist-200 object-cover shadow-sm ring-1 ring-mist-100 sm:size-24 sm:rounded-3xl dark:border-mist-800 dark:ring-mist-800/50"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-2xl border border-dashed border-mist-200 bg-mist-50 shadow-sm sm:size-24 sm:rounded-3xl dark:border-mist-700 dark:bg-mist-900">
            <PhotoIcon className="size-6 text-mist-400 dark:text-mist-500" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Text className="truncate text-base font-semibold leading-tight text-mist-800 dark:text-mist-100 flex gap-3">
          {name}
          <span>{formatServicePrice(price)}</span>
        </Text>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex font-medium items-center gap-1 text-sm text-mist-500 dark:text-mist-400">
            <ClockIcon className="size-4 shrink-0" />
            {formatDurationMinutesSmall(durationMinutes)}
          </span>

          {hasDiscount && (
            <>
              <span aria-hidden className="text-mist-300 dark:text-mist-600">
                ·
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                <TagIcon className="size-3.5 shrink-0" />
                {discountPercentage > 0 ? `-${discountPercentage}%` : 'Oferta'}
              </span>
            </>
          )}
        </div>

        <Text
          className={cn(
            'line-clamp-2 text-sm leading-relaxed ',
            description ? 'text-mist-500 dark:text-mist-400' : 'text-mist-400 dark:text-mist-500',
          )}
        >
          {description ?? 'Sin descripción'}
        </Text>
      </div>

      <button
        type="button"
        className="absolute right-4 top-4 p-1 rounded-full hover:bg-mist-100 dark:hover:bg-mist-900 cursor-pointer transition-colors"
      >
        <EllipsisHorizontalIcon className="size-6 text-mist-400 dark:text-mist-500" />
      </button>
    </Card>
  );
}
