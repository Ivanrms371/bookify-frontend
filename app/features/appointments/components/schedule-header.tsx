import { usePermissions } from '@/core/auth/use-permissions';
import { ResponsiveFilters } from '@/shared/components/ui/responsive-filters';
import { Button } from '@/shared/components/ui';
import { Select } from '@/shared/components/ui/select';
import { BarsArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, UserIcon, FunnelIcon } from '@heroicons/react/20/solid';
import { formatDateFull } from '@/shared/utils/date';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { parseISO } from 'date-fns';
import type { AgendaFilters, CalendarState, CalendarOrder } from '../types/agenda.types';
export type { CalendarState, CalendarOrder } from '../types/agenda.types';
import type { ProfessionalBasic } from '@/features/professionals/types/professional.types';

interface Props {
  state: CalendarState;
  order: CalendarOrder;
  professionalId: string;
  professionals: ProfessionalBasic[];
  professionalsLoading: boolean;
  onFiltersChange: (filters: AgendaFilters) => void;
  selectedDate: string;
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
  onFiltersChange,
}: Props) => {
  const { open } = useOverlay('create-appointment-drawer');
  const { can } = usePermissions();

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
        <div className="text-sm font-medium text-gray-700">{formatDateFull(parseISO(selectedDate))}</div>
      </div>

      <ResponsiveFilters
        active={state !== 'all' || order !== 'latest' || professionalId !== 'all'}
        onApply={(values) =>
          onFiltersChange({
            state: (values.Estado ?? state) as CalendarState,
            order: (values['Ordenar por'] ?? order) as CalendarOrder,
            professionalId: values.Profesional ?? professionalId,
          })
        }
        action={
          can('appointment:create') ? <Button variant="primary" className="shrink-0" onClick={() => open({ defaultDate: selectedDate })}>
            <PlusIcon className="size-5" /> Nueva Reserva
          </Button> : null
        }
      >
        <Select
          label="Estado"
          value={state}
          onValueChange={(value) => onFiltersChange({ state: value as CalendarState, order, professionalId })}
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
          onValueChange={(value) => onFiltersChange({ state, order: value as CalendarOrder, professionalId })}
          icon={<BarsArrowUpIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'latest', label: 'Más recientes' },
            { value: 'hour-asc', label: 'Hora: primero las más tempranas' },
            { value: 'hour-desc', label: 'Hora: primero las más tardías' },
          ]}
        />
        {can('appointment:read_others') && <Select
          label="Profesional"
          value={professionalId}
          onValueChange={(value) => onFiltersChange({ state, order, professionalId: value })}
          disabled={professionalsLoading}
          icon={<UserIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'all', label: 'Todos los profesionales' },
            ...professionals.map((professional) => ({ value: professional.id, label: professional.name })),
          ]}
        />}
      </ResponsiveFilters>
    </div>
  );
};
