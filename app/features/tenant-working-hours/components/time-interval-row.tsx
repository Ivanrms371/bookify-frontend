import { Input } from '@/shared/components/form/Input';
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
    <div className="relative flex items-center justify-between gap-2 pr-4">
      <TrashButton size="sm" label="Eliminar intervalo" className="absolute -right-4 sm:-right-4 sm:top-2.5 top-9" onClick={onRemove} />
      <div className="relative w-full">
        <span className="sm:absolute top-3 left-2 font-medium text-mist-500 z-10 text-sm">Desde</span>
        <Input
          className="w-full sm:pl-14 text-sm"
          type="time"
          value={interval.opens}
          onChange={(e) => onChange?.({ ...interval, opens: e.target.value })}
        />
      </div>

      <span className="text-xs font-light text-mist-300 t-6 sm:mt-0 sm:block hidden">
        <MinusIcon className="size-3 text-mist-400" />
      </span>

      <div className="relative w-full">
        <span className="sm:absolute top-3 left-2 font-medium text-mist-500 z-10 text-sm">Hasta</span>
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
