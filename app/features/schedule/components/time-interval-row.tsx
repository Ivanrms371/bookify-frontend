import { useFormContext } from 'react-hook-form';
import { TrashIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';

import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import type { SaveWorkingHours } from '../schemas/schedule-form-schema';

interface Props {
  dayIndex: number;
  intervalIndex: number;
  onRemove?: () => void;
}

export const TimeIntervalRow = ({ dayIndex, intervalIndex, onRemove }: Props) => {
  const { register } = useFormContext<SaveWorkingHours>();

  return (
    <div className="relative flex items-center gap-1">
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <TrashIcon className="size-4" />
        </Button>
      )}

      <div className="relative w-full">
        <Input
          className="w-full pl-14 text-sm"
          type="time"
          fullWidth={false}
          leftIcon={<span className="pointer-events-none text-sm font-medium text-gray-500">Desde</span>}
          {...register(`workingHours.${dayIndex}.intervals.${intervalIndex}.opensAt`)}
        />
      </div>

      <div className="size-4.5 shrink-0 text-gray-700">
        <ArrowLongRightIcon className="size-4.5" />
      </div>

      <div className="relative w-full">
        <Input
          className="w-full pl-14 text-sm"
          type="time"
          fullWidth={false}
          leftIcon={<span className="pointer-events-none text-sm font-medium text-gray-500">Hasta</span>}
          {...register(`workingHours.${dayIndex}.intervals.${intervalIndex}.closesAt`)}
        />
      </div>
    </div>
  );
};
