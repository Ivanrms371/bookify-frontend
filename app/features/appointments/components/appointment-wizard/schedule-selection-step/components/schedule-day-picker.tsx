import { getUpcomingDays } from '@/features/appointments/utils/date-helpers';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useRef } from 'react';
import { useAppointmentWizard } from '../../appointment-wizard-context';

interface Props {
  onSelectDate: (date: string) => void;
}

export const ScheduleDayPicker = ({ onSelectDate }: Props) => {
  const { state } = useAppointmentWizard();
  const upcomingDays = getUpcomingDays();
  const scrollRef = useRef<HTMLUListElement>(null);

  const touchStartX = useRef<number>(0);
  const touchScrollLeft = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLUListElement>) => {
    if (!scrollRef.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchScrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLUListElement>) => {
    if (!scrollRef.current) return;

    const currentX = e.touches[0].clientX;
    const differenceX = touchStartX.current - currentX;

    scrollRef.current.scrollLeft = touchScrollLeft.current + differenceX;
  };

  const handleArrowClick = (direction: 'left' | 'right' | 'today') => {
    if (scrollRef.current) {
      const scrollAmount = 300;

      if (direction === 'today') {
        scrollRef.current.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
        return;
      }
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Text className="font-semibold text-lg text-gray-700">Selecciona una Fecha</Text>
        <div className="flex gap-2">
          <Button size="icon" variant="secondary" onClick={() => handleArrowClick('left')}>
            <ChevronLeftIcon className="size-5 text-gray-700" />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleArrowClick('today')}>
            Hoy
          </Button>
          <Button size="icon" variant="secondary" onClick={() => handleArrowClick('right')}>
            <ChevronRightIcon className="size-5 text-gray-700" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <ul
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="flex gap-1.5 overflow-hidden pb-3 select-none"
        >
          {upcomingDays.map((item) => {
            const isSelected = state?.data.date === item.date;

            return (
              <li key={item.date} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectDate(item.date)}
                  className={cn(
                    'flex flex-col items-center justify-center p-1 border border-gray-200 hover:bg-gray-100/50 hover:border-gray-300 rounded-lg w-12 h-14 transition-colors cursor-pointer',
                    isSelected && 'border-indigo-600 hover:border-indigo-600 hover:bg-white',
                  )}
                >
                  <span className={cn('font-medium text-gray-800', isSelected && 'text-indigo-600')}>{item.dayNumber}</span>
                  <span className={cn('text-sm font-medium text-gray-400 capitalize', isSelected && 'text-indigo-400')}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
