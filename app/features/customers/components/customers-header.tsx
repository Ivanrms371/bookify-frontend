import { BarsArrowUpIcon, CalendarDaysIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { Select } from '@/shared/components/ui/select';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { GetAllCustomersParams } from '../types/customer-types';

export type CustomerSort = 'name' | 'newest' | 'last-visit' | 'spending';
export type CustomerStatus = NonNullable<GetAllCustomersParams['status']>;
export type BookingActivity = NonNullable<GetAllCustomersParams['bookingActivity']>;

interface Props {
  search: string;
  status: CustomerStatus;
  activity: BookingActivity;
  sort: CustomerSort;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CustomerStatus) => void;
  onActivityChange: (value: BookingActivity) => void;
  onSortChange: (value: CustomerSort) => void;
}

export function CustomersHeader({ search, status, activity, sort, onSearchChange, onStatusChange, onActivityChange, onSortChange }: Props) {
  const { open } = useOverlay('create-customer-modal');
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-full md:min-w-64 md:flex-1">
        <Input
          type="search"
          aria-label="Buscar clientes por nombre, email o teléfono"
          placeholder="Buscar por nombre, email o teléfono..."
          maxLength={200}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leftIcon={<MagnifyingGlassIcon className="size-4 text-gray-500" />}
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 md:ml-auto md:w-auto">
        <Select
          label="Estado"
          value={status}
          onValueChange={(value) => onStatusChange(value as CustomerStatus)}
          icon={<FunnelIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'unblocked', label: 'Sin bloquear' },
            { value: 'blocked', label: 'Bloqueados' },
          ]}
        />
        <Select
          label="Actividad de reservas"
          value={activity}
          onValueChange={(value) => onActivityChange(value as BookingActivity)}
          icon={<CalendarDaysIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'all', label: 'Todas las reservas' },
            { value: 'upcoming', label: 'Con próximas citas' },
            { value: 'never-booked', label: 'Nunca reservaron' },
          ]}
        />
        <Select
          label="Ordenar por"
          value={sort}
          onValueChange={(value) => onSortChange(value as CustomerSort)}
          icon={<BarsArrowUpIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'name', label: 'Nombre A–Z' },
            { value: 'newest', label: 'Más recientes' },
            { value: 'last-visit', label: 'Última visita' },
            { value: 'spending', label: 'Mayor gasto' },
          ]}
        />
        <Button variant="primary" className="shrink-0" icon={<PlusIcon className="size-5" />} iconPosition="left" onClick={open}>
          Nuevo Cliente
        </Button>
      </div>
    </div>
  );
}
