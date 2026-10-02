import { cn } from '@/shared/utils/cn';
import type { AppointmentAvailabilitySlot } from '@/features/availability';

type Props = {
  slots: AppointmentAvailabilitySlot[];
  selectedStartsAt: string | null;
  disabled?: boolean;
  onSelect: (slot: AppointmentAvailabilitySlot) => void;
};

export function AppointmentTimeSlotGrid({ slots, selectedStartsAt, disabled, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {slots.map((slot) => {
        const isSelected = slot.startsAt === selectedStartsAt;
        const isUnavailable = slot.status === 'busy';
        return (
          <button
            type="button"
            key={slot.startsAt}
            disabled={isUnavailable || disabled}
            aria-pressed={isSelected}
            onClick={() => onSelect(slot)}
            className={cn(
              'h-10 cursor-pointer rounded-lg border border-border bg-background text-sm font-semibold text-foreground transition-colors focus-visible:border-indigo-500 focus-visible:outline-none',
              !isSelected && !isUnavailable && !disabled && 'hover:bg-gray-100',
              isUnavailable && 'cursor-not-allowed border-transparent bg-muted text-muted-foreground line-through',
              disabled && 'cursor-not-allowed opacity-50',
              isSelected && !isUnavailable && 'border-indigo-500',
            )}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
