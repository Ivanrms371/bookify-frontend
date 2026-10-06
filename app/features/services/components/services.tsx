import { usePermissions } from '@/core/auth/use-permissions';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { ResponsiveFilters } from '@/shared/components/ui/responsive-filters';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useServicesPage } from '../hooks/use-services-page';
import { SERVICES_PAGE_SIZE as PAGE_SIZE } from '../utils/services-page-model';
import { ServiceCard } from './grid/service-card';
import { ServicesTable } from './table/services-table';
import { Button } from '@/shared/components/ui';
import { TableSkeleton } from '@/shared/components/ui/table';
import { Select } from '@/shared/components/ui/select';
import { BarsArrowUpIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon, ClockIcon, TagIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';
export const Services = () => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  if (!tenantId) return <TableSkeleton label="Cargando servicios..." columns={[{ label: 'Servicios' }]} />;
  return <ServicesPage key={tenantId} />;
};

function ServicesPage() {
  const { open } = useOverlay('create-service-modal');
  const { can } = usePermissions();
  const desktop = useMediaQuery('(min-width: 768px)');
  const model = useServicesPage();
  const { search, status, duration, discount, sort, page, services, total, active, loading, setSearch, setPage, clear } = model;
  const { isError, isFetching, isPlaceholderData, refetch } = model.query;
  const filters = { status, duration, discount, sort };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full md:min-w-64 md:flex-1">
          <Input
            type="search"
            aria-label="Buscar servicios por nombre o descripción"
            placeholder="Buscar por nombre o descripción..."
            maxLength={200}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            leftIcon={<MagnifyingGlassIcon className="size-4 text-gray-500" />}
          />
        </div>
        <ResponsiveFilters
          active={model.filtersActive}
          onApply={(values) =>
            model.applyFilters({
              status: values.Estado ?? status,
              duration: values['Duración'] ?? duration,
              discount: values.Descuento ?? discount,
              sort: values['Ordenar por'] ?? sort,
            })
          }
          action={
            can('service:create') ? <Button variant="primary" onClick={open} icon={<PlusIcon className="size-5" />} iconPosition="left">
              Nuevo Servicio
            </Button> : null
          }
        >
          <Select
            label="Estado"
            value={status}
            onValueChange={(value) => model.applyFilters({ ...filters, status: value })}
            icon={<FunnelIcon className="size-4" />}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'active', label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' },
            ]}
          />
          <Select
            label="Duración"
            value={duration}
            onValueChange={(value) => model.applyFilters({ ...filters, duration: value })}
            icon={<ClockIcon className="size-4" />}
            options={[
              { value: 'all', label: 'Todas las duraciones' },
              { value: 'short', label: 'Hasta 30 min' },
              { value: 'medium', label: '31–60 min' },
              { value: 'long', label: 'Más de 60 min' },
            ]}
          />
          <Select
            label="Descuento"
            value={discount}
            onValueChange={(value) => model.applyFilters({ ...filters, discount: value })}
            icon={<TagIcon className="size-4" />}
            options={[
              { value: 'all', label: 'Todos los descuentos' },
              { value: 'with', label: 'Con descuento' },
              { value: 'without', label: 'Sin descuento' },
            ]}
          />
          <Select
            label="Ordenar por"
            value={sort}
            onValueChange={(value) => model.applyFilters({ ...filters, sort: value })}
            icon={<BarsArrowUpIcon className="size-4" />}
            options={[
              { value: 'name', label: 'Nombre A–Z' },
              { value: 'newest', label: 'Más recientes' },
              { value: 'price-asc', label: 'Menor precio' },
              { value: 'price-desc', label: 'Mayor precio' },
              { value: 'duration', label: 'Menor duración' },
            ]}
          />
        </ResponsiveFilters>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {loading
            ? 'Buscando servicios...'
            : isPlaceholderData
              ? 'Cargando resultados...'
              : isError
                ? 'Resultados no disponibles'
                : `${total} ${total === 1 ? 'servicio encontrado' : 'servicios encontrados'}`}
        </p>
        {active && (
          <Button variant="secondary" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        )}
      </div>
      {loading ? (
        <TableSkeleton
          label="Cargando servicios..."
          tableClassName="min-w-225"
          columns={[
            { label: 'Servicio', variant: 'thumbnail', width: 'w-32', secondaryLine: true },
            { label: 'Duración', width: 'w-20' },
            { label: 'Precio', width: 'w-20' },
            { label: 'Descuento', width: 'w-24' },
            { label: 'Estado', variant: 'badge' },
            { label: 'Acciones', variant: 'actions', align: 'right' },
          ]}
        />
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <p>No se pudieron cargar los servicios.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={<SparklesIcon />}
          title="No hemos encontrado servicios"
          description={active ? 'Probá con otros filtros o cambiá la búsqueda.' : 'Agregá tu primer servicio para comenzar.'}
        />
      ) : (
        <>
          {isFetching && (
            <p className="text-sm text-gray-500" role="status">
              Actualizando servicios...
            </p>
          )}
          <div aria-busy={isFetching}>
            {desktop ? (
              <ServicesTable services={services} />
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-sm text-gray-500">
                {isPlaceholderData
                  ? 'Cargando página...'
                  : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} de ${total} servicios`}
              </p>
              <Button variant="secondary" size="sm" disabled={page === 0 || isPlaceholderData} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={(page + 1) * PAGE_SIZE >= total || isPlaceholderData}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
