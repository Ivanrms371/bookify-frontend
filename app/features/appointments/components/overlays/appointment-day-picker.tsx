import { useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export type AppointmentDayOption = { date: string; dayNumber: string; label: string };

type Props = {
  title?: string;
  days: AppointmentDayOption[];
  selectedDate: string;
  disabled?: boolean;
  previousDisabled?: boolean;
  onSelect: (date: string) => void;
  onPrevious?: (daysCount: number) => void;
  onNext?: (daysCount: number) => void;
};

export function AppointmentDayPicker({
  title = 'Cambiar horario',
  days,
  selectedDate,
  disabled,
  previousDisabled,
  onSelect,
  onPrevious,
  onNext,
}: Props) {
  const strip = useRef<HTMLDivElement>(null);
  const selected = useRef<HTMLButtonElement>(null);
  const previousPositions = useRef<number[]>([]);
  const pageDirection = useRef<-1 | 1 | null>(null);
  const [atStart, setAtStart] = useState(true);

  const moveDays = (direction: -1 | 1) => {
    const container = strip.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
    if (!cards.length) return;
    const firstLeft = cards[0].offsetLeft;
    const stride = cards[1] ? cards[1].offsetLeft - firstLeft : cards[0].offsetWidth;
    const visibleCount = Math.max(1, Math.floor((container.clientWidth - firstLeft * 2 + stride - cards[0].offsetWidth) / stride));
    const currentIndex = Math.round(container.scrollLeft / stride);
    const nextIndex = currentIndex + direction * visibleCount;
    if (direction < 0 && previousPositions.current.length > 0) {
      const left = previousPositions.current.pop()!;
      setAtStart(left <= 1);
      container.scrollTo({ left, behavior: 'smooth' });
      return;
    }
    if (direction < 0 && container.scrollLeft <= 1) {
      if (onPrevious) pageDirection.current = -1;
      onPrevious?.(visibleCount);
      return;
    }
    if (direction > 0 && container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
      if (onNext) pageDirection.current = 1;
      onNext?.(days.length);
      return;
    }
    const target = cards[Math.max(0, Math.min(cards.length - 1, nextIndex))];
    const left = Math.min(target.offsetLeft - firstLeft, container.scrollWidth - container.clientWidth);
    if (direction > 0) previousPositions.current.push(container.scrollLeft);
    setAtStart(left <= 1);
    container.scrollTo({ left, behavior: 'smooth' });
  };

  useEffect(() => {
    previousPositions.current = [];
    strip.current?.scrollTo({ left: 0 });
    setAtStart(true);
    const direction = pageDirection.current;
    pageDirection.current = null;
    const content = strip.current?.firstElementChild;
    if (direction && content && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      content.animate(
        [{ transform: `translateX(${direction * 40}px)`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
        { duration: 250, easing: 'ease-out' },
      );
    }
  }, [days[0]?.date]);

  useEffect(() => {
    const container = strip.current;
    const button = selected.current;
    if (!container || !button) return;
    const left = button.offsetLeft - container.offsetLeft;
    if (left < container.scrollLeft || left + button.offsetWidth > container.scrollLeft + container.clientWidth) {
      container.scrollTo({ left: Math.max(0, left - container.clientWidth / 2 + button.offsetWidth / 2), behavior: 'smooth' });
    }
  }, [selectedDate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-bold text-gray-800 md:text-2xl">{title}</p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Ver días anteriores"
            disabled={disabled || (previousDisabled && atStart)}
            onClick={() => moveDays(-1)}
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Ver días siguientes"
            disabled={disabled}
            onClick={() => moveDays(1)}
          >
            <ChevronRightIcon className="size-5" />
          </Button>
        </div>
      </div>
      <div ref={strip} onScroll={() => setAtStart((strip.current?.scrollLeft ?? 0) <= 1)} className="relative -mx-1 overflow-x-auto px-1 py-1">
        <div className="flex gap-3">
          {days.map((day) => {
            const isSelected = day.date === selectedDate;
            return (
              <button
                ref={isSelected ? selected : undefined}
                type="button"
                key={day.date}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={format(parseISO(day.date), "EEEE d 'de' MMMM", { locale: es })}
                onClick={() => onSelect(day.date)}
                className={cn(
                  'flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-3 text-gray-700 transition-colors focus-visible:border-indigo-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  !isSelected && !disabled && 'hover:bg-gray-100',
                  isSelected && 'border-indigo-600 bg-indigo-600 text-white',
                )}
              >
                <span className={cn('font-display text-sm font-normal capitalize', isSelected ? 'text-white' : 'text-gray-700')}>
                  {day.label}
                </span>
                <span className="font-display text-2xl font-bold">{day.dayNumber}</span>
                <span className={cn('text-sm font-normal capitalize', isSelected ? 'text-white' : 'text-gray-500')}>
                  {format(parseISO(day.date), 'MMM', { locale: es }).replace('.', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
