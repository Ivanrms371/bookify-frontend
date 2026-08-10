import { Input } from '@/shared/components/form/input';
import { Button, TrashButton } from '@/shared/components/ui';
import { type Interval } from '@/shared/constants/week-days';
import { MinusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  interval: Interval;
  onRemove?: () => void;
  onChange: (interval: Interval) => void;
}

export const TimeIntervalRow = ({ interval, onRemove, onChange }: Props) => {
  return (
    <div className="relative flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon" onClick={() => onRemove?.()}>
        <TrashIcon className="size-4 text-red-500" />
      </Button>
      <div className="relative w-full">
        <Input
          className="w-full text-sm"
          type="time"
          value={interval.opens}
          onChange={(e) => onChange?.({ ...interval, opens: e.target.value })}
        />
      </div>

      <span className="text-sm font-light text-gray-500 mt-6 sm:mt-0">a</span>

      <div className="relative w-full">
        <Input
          className="w-full text-sm"
          type="time"
          value={interval.closes}
          onChange={(e) => onChange?.({ ...interval, closes: e.target.value })}
        />
      </div>
    </div>
  );
};
