import { usePermissions } from '@/core/auth/use-permissions';
import { ResponsiveFilters } from '@/shared/components/ui/responsive-filters';
import { BarsArrowUpIcon, CalendarDaysIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { Select } from '@/shared/components/ui/select';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { BookingActivity, CustomerFilters, CustomerSort, CustomerStatus } from '../utils/customers-page-model';
export type { BookingActivity, CustomerSort, CustomerStatus } from '../utils/customers-page-model';

interface Props {
  search: string;
  status: CustomerStatus;
  activity: BookingActivity;
  sort: CustomerSort;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: CustomerFilters) => void;
}

export function CustomersHeader({ search, status, activity, sort, onSearchChange, onFiltersChange }: Props) {
  const { open } = useOverlay('create-customer-modal');
  const { can } = usePermissions();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-full md:min-w-64 md:flex-1">
        <Input
          type="search"
          aria-label="Buscar clientes por nombre, email o teléfono"
          placeholder="Buscar clientes (mín. 3 caracteres)"
          maxLength={200}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leftIcon={<MagnifyingGlassIcon className="size-4 text-gray-500" />}
        />
      </div>
      <ResponsiveFilters
        active={status !== 'all' || activity !== 'all' || sort !== 'name'}
        onApply={(values) =>
          onFiltersChange({
            status: (values.Estado ?? status) as CustomerStatus,
            activity: (values['Actividad de reservas'] ?? activity) as BookingActivity,
            sort: (values['Ordenar por'] ?? sort) as CustomerSort,
          })
        }
        action={
          can('customer:create') ? <Button variant="primary" className="shrink-0" icon={<PlusIcon className="size-5" />} iconPosition="left" onClick={open}>
            Nuevo Cliente
          </Button> : null
        }
      >
        <Select
          label="Estado"
          value={status}
          onValueChange={(value) => onFiltersChange({ status: value as CustomerStatus, activity, sort })}
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
          onValueChange={(value) => onFiltersChange({ status, activity: value as BookingActivity, sort })}
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
          onValueChange={(value) => onFiltersChange({ status, activity, sort: value as CustomerSort })}
          icon={<BarsArrowUpIcon className="size-4" />}
          className="flex-1 sm:flex-none"
          options={[
            { value: 'name', label: 'Nombre A–Z' },
            { value: 'newest', label: 'Más recientes' },
            { value: 'last-visit', label: 'Última visita' },
            { value: 'spending', label: 'Mayor gasto' },
          ]}
        />
      </ResponsiveFilters>
    </div>
  );
}
