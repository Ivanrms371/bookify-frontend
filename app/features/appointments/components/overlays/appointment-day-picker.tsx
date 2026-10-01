import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
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
  const [range, setRange] = useState(() => ({
    start: format(addDays(parseISO(days[0].date), -42), 'yyyy-MM-dd'),
    end: format(addDays(parseISO(days[days.length - 1].date), 42), 'yyyy-MM-dd'),
  }));
  const pendingScroll = useRef<{ anchor: string; target: string } | null>(null);
  const initialized = useRef(false);
  const renderedDays = Array.from(
    { length: differenceInCalendarDays(parseISO(range.end), parseISO(range.start)) + 1 },
    (_, index) => {
      const date = addDays(parseISO(range.start), index);
      return { date: format(date, 'yyyy-MM-dd'), dayNumber: format(date, 'd'), label: format(date, 'EEE', { locale: es }).replace('.', '') };
    },
  );
  const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

  const moveDays = (direction: -1 | 1) => {
    const container = strip.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
    const stride = cards[1].offsetLeft - cards[0].offsetLeft;
    const visibleCount = Math.max(1, Math.floor((container.clientWidth - 8 + stride - cards[0].offsetWidth) / stride));
    const index = Math.round(container.scrollLeft / stride);
    const anchor = renderedDays[index].date;
    const target = format(addDays(parseISO(anchor), direction * visibleCount), 'yyyy-MM-dd');
    if (target < range.start || target > format(addDays(parseISO(range.end), -visibleCount), 'yyyy-MM-dd')) {
      pendingScroll.current = { anchor, target };
      setRange({
        start: target < range.start ? format(addDays(parseISO(target), -42), 'yyyy-MM-dd') : range.start,
        end: target > format(addDays(parseISO(range.end), -visibleCount), 'yyyy-MM-dd')
          ? format(addDays(parseISO(target), 42), 'yyyy-MM-dd') : range.end,
      });
    } else {
      container.scrollTo({ left: differenceInCalendarDays(parseISO(target), parseISO(range.start)) * stride, behavior: scrollBehavior() });
    }
    if (direction < 0) onPrevious?.(visibleCount);
    else onNext?.(visibleCount);
  };

  useLayoutEffect(() => {
    const container = strip.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLButtonElement>('button');
    const stride = cards[1].offsetLeft - cards[0].offsetLeft;
    const alignInitialDay = () => {
      const button = selected.current;
      if (initialized.current || !button || !container.clientWidth || !button.offsetWidth) return;
      container.scrollTo({ left: button.offsetLeft - cards[0].offsetLeft, behavior: 'instant' });
      initialized.current = true;
    };
    alignInitialDay();
    const observer = new ResizeObserver(alignInitialDay);
    observer.observe(container);
    const pending = pendingScroll.current;
    if (pending) {
      pendingScroll.current = null;
      container.scrollTo({ left: differenceInCalendarDays(parseISO(pending.anchor), parseISO(range.start)) * stride, behavior: 'instant' });
      container.scrollTo({ left: differenceInCalendarDays(parseISO(pending.target), parseISO(range.start)) * stride, behavior: scrollBehavior() });
    }
    return () => observer.disconnect();
  }, [range]);

  useEffect(() => {
    const container = strip.current;
    const button = selected.current;
    if (!container || !button || !initialized.current) return;
    const first = container.querySelector<HTMLButtonElement>('button');
    if (!first) return;
    const left = button.offsetLeft - first.offsetLeft;
    if (left < container.scrollLeft || left + button.offsetWidth > container.scrollLeft + container.clientWidth) {
      container.scrollTo({ left, behavior: scrollBehavior() });
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
            disabled={disabled || previousDisabled}
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
      <div ref={strip} className="relative -mx-1 overflow-x-auto px-1 py-1 [overflow-anchor:none]">
        <div className="flex gap-3">
          {renderedDays.map((day) => {
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
