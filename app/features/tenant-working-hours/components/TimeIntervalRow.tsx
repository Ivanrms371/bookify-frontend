import { Input } from '@/shared/components/form/input';
import { TrashButton } from '@/shared/components/ui';
import { type Interval } from '@/shared/constants/week-days';
import { MinusIcon } from '@heroicons/react/24/outline';

interface Props {
  interval: Interval;
  onRemove?: () => void;
  onChange: (interval: Interval) => void;
}

export const TimeIntervalRow = ({ interval, onRemove, onChange }: Props) => {
  return (
    <div className="relative flex items-center justify-between gap-0.5 pr-4">
      <TrashButton size="sm" label="Eliminar intervalo" className="absolute -right-4 sm:-right-4 sm:top-2.5 top-9" onClick={onRemove} />
      <div className="relative w-full">
        <span className="sm:absolute top-3 left-2 font-medium text-gray-500 text-sm">Desde</span>
        <Input
          className="w-full sm:pl-14 text-sm"
          type="time"
          value={interval.opens}
          onChange={(e) => onChange?.({ ...interval, opens: e.target.value })}
        />
      </div>

      <span className="text-xs font-light text-gray-300 dark:text-gray-700 mt-6 sm:mt-0">
        <MinusIcon className="size-2 text-gray-400" />
      </span>

      <div className="relative w-full">
        <span className="sm:absolute top-3 left-2 font-medium text-gray-500 text-sm">Hasta</span>
        <Input
          className="w-full sm:pl-14 text-sm"
          type="time"
          value={interval.closes}
          onChange={(e) => onChange?.({ ...interval, closes: e.target.value })}
        />
      </div>
    </div>
  );
};
