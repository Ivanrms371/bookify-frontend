import { Button } from '@/shared/components/ui';
import { Select } from '@/shared/components/ui/select';
import { BarsArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, UserIcon, FunnelIcon } from '@heroicons/react/20/solid';
import { formatDateFull } from '@/shared/utils/date';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { AppointmentStatus } from '../types/appointments-types';
import type { ProfessionalBasic } from '@/features/professionals/types/professional.types';

export type CalendarState = AppointmentStatus | 'all';
export type CalendarOrder = 'latest' | 'hour-asc' | 'hour-desc';

interface Props {
  state: CalendarState;
  order: CalendarOrder;
  professionalId: string;
  professionals: ProfessionalBasic[];
  professionalsLoading: boolean;
  onStateChange: (value: CalendarState) => void;
  onOrderChange: (value: CalendarOrder) => void;
  onProfessionalChange: (value: string) => void;
  selectedDate: Date;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}

export const ScheduleHeader = ({
  selectedDate,
  onNext,
  onPrevious,
  onToday,
  state,
  order,
  professionalId,
  professionals,
  professionalsLoading,
  onStateChange,
  onOrderChange,
  onProfessionalChange,
}: Props) => {
  const { open } = useOverlay('create-appointment-drawer');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <div className="flex shrink-0 items-center gap-1.5">
          <Button variant="secondary" type="button" size="icon" onClick={onPrevious} aria-label="Día anterior">
            <ChevronLeftIcon className="size-5" />
          </Button>
          <Button variant="secondary" type="button" size="sm" onClick={onToday}>
            Hoy
          </Button>
          <Button variant="secondary" type="button" size="icon" onClick={onNext} aria-label="Día siguiente">
            <ChevronRightIcon className="size-5" />
          </Button>
        </div>
        <div className="text-sm font-medium text-gray-700">{formatDateFull(selectedDate)}</div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 md:ml-auto md:w-auto">
        <Select
          label="Estado"
          value={state}
          onValueChange={(value) => onStateChange(value as CalendarState)}
          icon={<FunnelIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'PENDING', label: 'Pendiente' },
            { value: 'CONFIRMED', label: 'Confirmada' },
            { value: 'COMPLETED', label: 'Completada' },
            { value: 'CANCELLED', label: 'Cancelada' },
            { value: 'NO_SHOW', label: 'No asistió' },
          ]}
        />
        <Select
          label="Ordenar por"
          value={order}
          onValueChange={(value) => onOrderChange(value as CalendarOrder)}
          icon={<BarsArrowUpIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'latest', label: 'Más recientes' },
            { value: 'hour-asc', label: 'Hora: primero las más tempranas' },
            { value: 'hour-desc', label: 'Hora: primero las más tardías' },
          ]}
        />
        <Select
          label="Profesional"
          value={professionalId}
          onValueChange={onProfessionalChange}
          disabled={professionalsLoading}
          icon={<UserIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'all', label: 'Todos los profesionales' },
            ...professionals.map((professional) => ({ value: professional.id, label: professional.name })),
          ]}
        />
        <Button variant="primary" className="shrink-0" onClick={() => open({ defaultDate: selectedDate.toISOString().split('T')[0] })}>
          <PlusIcon className="size-5" /> Nueva Reserva
        </Button>
      </div>
    </div>
  );
};
