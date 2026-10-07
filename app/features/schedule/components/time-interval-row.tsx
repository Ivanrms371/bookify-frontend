import { useFormContext } from 'react-hook-form';
import { TrashIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';

import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { DAY_LABELS } from '@/shared/constants/week-days';
import type { SaveWorkingHours } from '../schemas/schedule-form-schema';

interface Props {
  dayIndex: number;
  intervalIndex: number;
  onRemove?: () => void;
}

export const TimeIntervalRow = ({ dayIndex, intervalIndex, onRemove }: Props) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SaveWorkingHours>();

  const intervalErrors = errors.workingHours?.[dayIndex]?.intervals?.[intervalIndex];

  const dayLabel = DAY_LABELS[watch(`workingHours.${dayIndex}.dayOfWeek`)].full;
  const opensId = `hours-${dayIndex}-${intervalIndex}-opens`;
  const closesId = `hours-${dayIndex}-${intervalIndex}-closes`;

  return (
    <div className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
      <div className="mb-3 flex min-h-8 items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-gray-500">Franja {intervalIndex + 1}</span>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Eliminar intervalo ${intervalIndex + 1} de ${dayLabel}`}
            title="Eliminar intervalo"
            className="rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <TrashIcon className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3">
        <Input
          id={opensId}
          label="Desde"
          className="min-w-0 w-full bg-white text-sm"
          type="time"
          aria-label={`Desde, ${dayLabel}, intervalo ${intervalIndex + 1}`}
          error={intervalErrors?.opensAt?.message}
          {...register(`workingHours.${dayIndex}.intervals.${intervalIndex}.opensAt`)}
        />
        <span className="mt-8 text-gray-400" aria-hidden="true">
          <ArrowLongRightIcon className="size-4" />
        </span>
        <Input
          id={closesId}
          label="Hasta"
          className="min-w-0 w-full bg-white text-sm"
          type="time"
          aria-label={`Hasta, ${dayLabel}, intervalo ${intervalIndex + 1}`}
          error={intervalErrors?.closesAt?.message}
          {...register(`workingHours.${dayIndex}.intervals.${intervalIndex}.closesAt`)}
        />
      </div>
    </div>
  );
};
