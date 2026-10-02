import { useEffect, useState } from 'react';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useServices } from '../hooks/use-services';
import { ServiceCard } from './grid/service-card';
import { ServicesTable } from './table/services-table';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui/spinner';
import { Select } from '@/shared/components/ui/select';
import { BarsArrowUpIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon, ClockIcon, TagIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { GetAllServicesParams } from '../types/services.types';

const PAGE_SIZE = 24;
const sorts: Record<string, { orderBy: string; order: 'asc' | 'desc' }> = {
  name: { orderBy: 'name', order: 'asc' },
  newest: { orderBy: 'createdAt', order: 'desc' },
  'price-asc': { orderBy: 'price', order: 'asc' },
  'price-desc': { orderBy: 'price', order: 'desc' },
  duration: { orderBy: 'durationMinutes', order: 'asc' },
};

export const Services = () => {
  const { open } = useOverlay('create-service-modal');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [duration, setDuration] = useState('all');
  const [discount, setDiscount] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(0);
  const trimmedSearch = search.trim();
  const searchQuery = trimmedSearch.length > 3 ? trimmedSearch : '';
  const query = useDebounce(searchQuery, 300);
  const [previousQuery, setPreviousQuery] = useState(query);
  if (query !== previousQuery) {
    setPreviousQuery(query);
    setPage(0);
  }
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useServices({
    query: query || undefined,
    isActive: status === 'all' ? undefined : status === 'active',
    duration: duration === 'all' ? undefined : (duration as GetAllServicesParams['duration']),
    discount: discount === 'all' ? undefined : (discount as GetAllServicesParams['discount']),
    ...sorts[sort],
    count: true,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const services = response?.data ?? [];
  const total = response?.meta.total ?? 0;
  const active = search !== '' || status !== 'all' || duration !== 'all' || discount !== 'all' || sort !== 'name';
  const loading = isLoading || query !== searchQuery;
  useEffect(() => {
    if (response && page > 0 && page * PAGE_SIZE >= total) setPage(Math.max(0, Math.ceil(total / PAGE_SIZE) - 1));
  }, [response, total, page]);
  const clear = () => {
    setSearch('');
    setStatus('all');
    setDuration('all');
    setDiscount('all');
    setSort('name');
    setPage(0);
  };
  const change = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(0);
  };
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
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <Select
            label="Estado"
            value={status}
            onValueChange={change(setStatus)}
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
            onValueChange={change(setDuration)}
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
            onValueChange={change(setDiscount)}
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
            onValueChange={change(setSort)}
            icon={<BarsArrowUpIcon className="size-4" />}
            options={[
              { value: 'name', label: 'Nombre A–Z' },
              { value: 'newest', label: 'Más recientes' },
              { value: 'price-asc', label: 'Menor precio' },
              { value: 'price-desc', label: 'Mayor precio' },
              { value: 'duration', label: 'Menor duración' },
            ]}
          />
          <Button variant="primary" onClick={open} icon={<PlusIcon className="size-5" />} iconPosition="left">
            Nuevo Servicio
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {loading
            ? 'Buscando servicios...'
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
        <div className="flex justify-center py-10" role="status" aria-label="Cargando servicios">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <p>No se pudieron cargar los servicios.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : services.length === 0 ? (
        <div className="space-y-2 py-10 text-center">
          <p className="font-semibold text-gray-600">No hemos encontrado servicios</p>
          <p className="text-gray-500">
            {active ? 'Probá con otros filtros o cambiá la búsqueda.' : 'Agregá tu primer servicio para comenzar.'}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <ServicesTable services={services} />
          </div>
          <div className="space-y-3 md:hidden">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-sm text-gray-500">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total} servicios
              </p>
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <Button variant="secondary" size="sm" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage(page + 1)}>
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
