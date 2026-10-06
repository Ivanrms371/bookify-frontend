import { ResponsiveFilters } from '@/shared/components/ui/responsive-filters';
import { Button } from '@/shared/components/ui';
import { Select } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/form/input';
import { BarsArrowUpIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon, TagIcon } from '@heroicons/react/20/solid';
import type { ProfessionalFilters } from '../utils/professionals-page-model';

type Props = ProfessionalFilters & {
  search: string;
  services: { id: string; name: string }[];
  servicesLoading: boolean;
  servicesError: boolean;
  canCreate: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ProfessionalFilters) => void;
  onRetryServices: () => void;
  onCreate: () => void;
};

export function ProfessionalsHeader({
  search,
  status,
  serviceId,
  sort,
  services,
  servicesLoading,
  servicesError,
  canCreate,
  onSearchChange,
  onFiltersChange,
  onRetryServices,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-full md:min-w-64 md:flex-1">
        <Input
          type="search"
          aria-label="Buscar profesionales por nombre o email"
          placeholder="Buscar por nombre o email..."
          maxLength={200}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leftIcon={<MagnifyingGlassIcon className="size-4 text-gray-500" />}
        />
      </div>
      <ResponsiveFilters
        active={status !== 'all' || serviceId !== 'all' || sort !== 'name'}
        onApply={(values) =>
          onFiltersChange({
            status: (values.Estado ?? status) as ProfessionalFilters['status'],
            serviceId: values['Servicio asignado'] ?? serviceId,
            sort: (values['Ordenar por'] ?? sort) as ProfessionalFilters['sort'],
          })
        }
        action={
          canCreate ? (
            <Button variant="primary" onClick={onCreate} icon={<PlusIcon className="size-5" />} iconPosition="left">
              Nuevo Profesional
            </Button>
          ) : null
        }
      >
        <Select
          label="Estado"
          value={status}
          onValueChange={(value) => onFiltersChange({ status: value as ProfessionalFilters['status'], serviceId, sort })}
          icon={<FunnelIcon className="size-4" />}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'active', label: 'Activos' },
            { value: 'inactive', label: 'Inactivos' },
          ]}
        />
        <Select
          label="Servicio asignado"
          value={serviceId}
          disabled={servicesLoading}
          onValueChange={(value) => onFiltersChange({ status, serviceId: value, sort })}
          icon={<TagIcon className="size-4" />}
          options={[
            { value: 'all', label: 'Todos los servicios' },
            ...services.map((service) => ({ value: service.id, label: service.name })),
          ]}
        />
        {servicesError && (
          <Button variant="secondary" size="sm" onClick={onRetryServices}>
            Reintentar servicios
          </Button>
        )}
        <Select
          label="Ordenar por"
          value={sort}
          onValueChange={(value) => onFiltersChange({ status, serviceId, sort: value as ProfessionalFilters['sort'] })}
          icon={<BarsArrowUpIcon className="size-4" />}
          options={[
            { value: 'name', label: 'Nombre A–Z' },
            { value: 'newest', label: 'Más recientes' },
          ]}
        />
      </ResponsiveFilters>
    </div>
  );
}
