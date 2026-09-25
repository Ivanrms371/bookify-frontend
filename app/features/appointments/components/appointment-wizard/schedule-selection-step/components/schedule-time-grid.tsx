import { Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';
import { useAppointmentWizard } from '../../appointment-wizard-context';
import { StatusPlaceholder } from '@/shared/components/ui';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { formatDisplayDate } from '@/features/appointments/utils/date-helpers';
import { Spinner } from '@/shared/components/ui/spinner';

interface Props {
  slots: string[];
  isLoading: boolean;
  nextAvailableDate: string | null;
  date: string;
  onSelectSlot: (slot: string) => void;
  onSelectDate: (date: string) => void;
}

export const ScheduleTimeGrid = ({ slots, nextAvailableDate, date, onSelectSlot, onSelectDate, isLoading }: Props) => {
  const { state } = useAppointmentWizard();

  if (isLoading) return <Spinner />;

  if (slots.length === 0)
    return (
      <StatusPlaceholder
        title={`Sin disponiblidad`}
        description={nextAvailableDate ? `No hay horarios disponibles hasta el ${formatDisplayDate(nextAvailableDate)}` : ''}
        icon={<CalendarDaysIcon className="size-6" />}
        actionText={`Ir al siguiente día disponible`}
        action={() => {
          if (!nextAvailableDate) return;
          onSelectDate(nextAvailableDate);
        }}
      />
    );

  return (
    <div>
      <Text className="font-semibold text-lg text-gray-700 mb-2">Selecciona una Hora</Text>

      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => {
          const isSelected = slot === state.data.time;

          return (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onSelectSlot(slot)}
              className={cn(
                'px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-100/50 hover:border-gray-300 rounded-lg transition-colors cursor-pointer',
                isSelected && 'border-indigo-600 text-indigo-600 hover:border-indigo-600 hover:bg-white',
              )}
              key={slot}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};
