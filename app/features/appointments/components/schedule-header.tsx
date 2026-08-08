import { Button } from '@/shared/components/ui';
import { BarsArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { formatDateFull } from '@/shared/utils/date';

interface Props {
  selectedDate: Date;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}

export const ScheduleHeader = ({ selectedDate, onNext, onPrevious, onToday }: Props) => {
  return (
    <div className="flex gap-2 justify-between">
      <div className="w-full">
        <div className="flex flex-row gap-1.5 items-center">
          <Button variant="secondary" type="button" size="icon" onClick={onPrevious}>
            <ChevronLeftIcon className="size-5" />
          </Button>
          <Button variant="secondary" type="button" size="sm" onClick={onToday}>
            Hoy
          </Button>
          <Button variant="secondary" type="button" size="icon" onClick={onNext}>
            <ChevronRightIcon className="size-5" />
          </Button>
          <div className="ml-3 text-sm text-gray-700 font-medium">{formatDateFull(selectedDate)}</div>
        </div>
      </div>
    </div>
  );
};
