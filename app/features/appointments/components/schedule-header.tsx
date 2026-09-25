import { Button } from '@/shared/components/ui';
import { BarsArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/20/solid';

import { formatDateFull } from '@/shared/utils/date';
import { useOverlay } from '@/shared/hooks/use-overlay';

interface Props {
  selectedDate: Date;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}

export const ScheduleHeader = ({ selectedDate, onNext, onPrevious, onToday }: Props) => {
  const { open } = useOverlay('new-appointment-modal');

  return (
    <div className="flex gap-2 justify-between items-center">
      <div className="flex-1">
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

      <div>
        <Button variant="primary" onClick={() => open({})}>
          <PlusIcon className="size-5" /> Nueva Reserva
        </Button>
      </div>
    </div>
  );
};
