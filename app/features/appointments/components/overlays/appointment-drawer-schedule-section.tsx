import { Spinner } from '@/shared/components/ui/spinner';
import type { AppointmentAvailabilitySlot, AppointmentAvailabilityDay } from '@/features/availability';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Callout } from '@/shared/components/ui';
import { AppointmentDayPicker, type AppointmentDayOption } from './appointment-day-picker';
import { AppointmentTimeSlotGrid } from './appointment-time-slot-grid';

type Props = {
  title?: string;
  days: AppointmentDayOption[];
  slots: AppointmentAvailabilitySlot[];
  availabilityDays?: AppointmentAvailabilityDay[];
  selectedDate: string;
  selectedStartsAt: string | null;
  isLoading?: boolean;
  isDisabled?: boolean;
  missingSelection?: 'service' | 'professional';
  interactionDisabled?: boolean;
  previousDisabled?: boolean;
  onPreviousPage?: (daysCount: number) => void;
  onNextPage?: (daysCount: number) => void;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: AppointmentAvailabilitySlot) => void;
};

export function AppointmentDrawerScheduleSection({
  title = 'Seleccionar fecha',
  days,
  slots,
  availabilityDays = [],
  selectedDate,
  selectedStartsAt,
  isLoading,
  isDisabled,
  missingSelection,
  interactionDisabled,
  previousDisabled,
  onPreviousPage,
  onNextPage,
  onSelectDate,
  onSelectSlot,
}: Props) {
  const isSelectable = (slot: AppointmentAvailabilitySlot) => slot.status !== 'busy';
  const isPastTime = Boolean(selectedStartsAt && new Date(selectedStartsAt).getTime() < Date.now());
  const nextAvailableDay = availabilityDays
    .filter((day) => day.date > selectedDate && day.slots.some(isSelectable))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <>
      <AppointmentDayPicker
        title={title}
        days={days}
        selectedDate={selectedDate}
        disabled={interactionDisabled}
        previousDisabled={previousDisabled}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
        onSelect={onSelectDate}
      />
      <p className="text-lg font-semibold text-gray-800">Seleccionar hora</p>
      {!isDisabled && isLoading ? (
        <div className="flex h-24 items-center justify-center">
          <Spinner />
        </div>
      ) : isDisabled || slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-200">
            <CalendarIcon className="size-7 text-indigo-500" aria-hidden="true" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {isDisabled
              ? missingSelection === 'professional'
                ? 'Seleccioná un profesional'
                : 'Seleccioná un servicio'
              : 'No hay horarios disponibles'}
          </p>
          {isDisabled ? (
            <p className="mt-2 max-w-sm text-base text-gray-500">
              {missingSelection === 'professional'
                ? 'Elegí quién realizará la cita para ver sus días y horarios disponibles.'
                : 'Elegí un servicio y un profesional para ver los horarios disponibles.'}
            </p>
          ) : nextAvailableDay ? (
            <>
              <p className="mt-2 text-base text-gray-500">
                Disponible a partir del{' '}
                <span className="font-medium text-gray-900">
                  {format(parseISO(nextAvailableDay.date), "EEEE, d 'de' MMMM", { locale: es })}
                </span>
                .
              </p>
              <Button
                type="button"
                variant="secondary"
                disabled={interactionDisabled}
                className="mt-4 rounded-full bg-white shadow-sm"
                onClick={() => onSelectDate(nextAvailableDay.date)}
              >
                Ir a la siguiente fecha disponible
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Button>
            </>
          ) : (
            <p className="mt-2 max-w-sm text-base text-gray-500">
              No encontramos horarios disponibles en las fechas cargadas para este profesional.
            </p>
          )}
        </div>
      ) : (
        <AppointmentTimeSlotGrid slots={slots} selectedStartsAt={selectedStartsAt} disabled={interactionDisabled} onSelect={onSelectSlot} />
      )}
      {!isDisabled && isPastTime && (
        <Callout type="warning">
          El horario seleccionado ya pasó. Si continuás, la cita quedará registrada en una fecha y hora pasadas.
        </Callout>
      )}
    </>
  );
}
