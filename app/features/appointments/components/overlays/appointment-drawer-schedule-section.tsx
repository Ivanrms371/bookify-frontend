import { cn } from '@/shared/utils/cn';
import { Spinner } from '@/shared/components/ui/spinner';
import type { AppointmentAvailabilitySlot } from '@/features/availability';

type DayOption = {
  date: string;
  dayNumber: string;
  label: string;
};

type Props = {
  days: DayOption[];
  slots: AppointmentAvailabilitySlot[];
  selectedDate: string;
  selectedStartsAt: string | null;
  isLoading?: boolean;
  isDisabled?: boolean;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: AppointmentAvailabilitySlot) => void;
};

export const AppointmentDrawerScheduleSection = ({
  days,
  slots,
  selectedDate,
  selectedStartsAt,
  isLoading = false,
  isDisabled = false,
  onSelectDate,
  onSelectSlot,
}: Props) => (
  <>
    <div className="-mx-1 overflow-x-auto px-1 py-2">
      <div className="flex gap-2">
        {days.map((day) => {
          const isSelected = day.date === selectedDate;

          return (
            <button
              type="button"
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                'flex h-16 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200 transition-colors hover:bg-gray-50',
                isSelected && 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-100',
              )}
            >
              <span className="text-sm font-bold">{day.dayNumber}</span>
              <span className="text-xs font-medium capitalize text-gray-500">{day.label}</span>
            </button>
          );
        })}
      </div>
    </div>

    {isDisabled ? (
      <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm font-medium text-gray-500">
        Seleccioná un servicio y profesional para ver horarios.
      </div>
    ) : isLoading ? (
      <div className="flex h-24 items-center justify-center">
        <Spinner />
      </div>
    ) : slots.length === 0 ? (
      <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm font-medium text-gray-500">
        No hay horarios configurados para este día.
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {slots.map((slot) => {
          const isSelected = slot.startsAt === selectedStartsAt;
          const isBusy = slot.status === 'busy';

          return (
            <button
              type="button"
              key={slot.startsAt}
              disabled={isBusy}
              onClick={() => onSelectSlot(slot)}
              className={cn(
                'h-9 cursor-pointer rounded-lg border border-gray-200 text-sm font-semibold transition-colors hover:bg-gray-50',
                slot.status === 'past' && 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
                isBusy && 'cursor-not-allowed bg-gray-100 text-gray-400 line-through hover:bg-gray-100',
                isSelected && 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-100',
              )}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    )}
  </>
);
