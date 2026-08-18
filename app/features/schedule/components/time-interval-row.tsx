import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { type Interval } from '@/shared/constants/week-days';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';

interface Props {
  interval: Interval;
  onRemove?: () => void;
  onChange: (interval: Interval) => void;
}

export const TimeIntervalRow = ({ interval, onRemove, onChange }: Props) => {
  return (
    <div className="relative flex items-center gap-1">
      {onRemove && (
        <Button variant="ghost" size="icon" onClick={() => onRemove()} className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0">
          <TrashIcon className="size-4" />
        </Button>
      )}
      <div className="relative w-full">
        <Input
          className="w-full text-sm pl-14"
          type="time"
          value={interval.opens}
          fullWidth={false}
          leftIcon={<span className="text-sm font-medium text-gray-500 pointer-events-none">Desde</span>}
          onChange={(e) => onChange({ ...interval, opens: e.target.value })}
        />
      </div>

      <div className="size-4.5 shrink-0 text-gray-700">
        <ArrowLongRightIcon className="size-4.5" />
      </div>

      <div className="relative w-full">
        <Input
          className="w-full text-sm pl-14"
          type="time"
          value={interval.closes}
          fullWidth={false}
          leftIcon={<span className="text-sm font-medium text-gray-500 pointer-events-none">Hasta</span>}
          onChange={(e) => onChange({ ...interval, closes: e.target.value })}
        />
      </div>
    </div>
  );
};
