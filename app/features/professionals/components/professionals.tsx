import { useAuthStore } from '@/core/auth/use-auth-store';
import { useEffect, useState } from 'react';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useQuery } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';
import { servicesApi } from '@/features/services/api/services-api';
import { ProfessionalsCard } from './list/professionals-card';
import { ProfessionalsTable } from './table/professionals-table';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui/spinner';
import { Select } from '@/shared/components/ui/select';
import { BarsArrowUpIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon, TagIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';
import { useDebounce } from '@/shared/hooks/useDebounce';

const PAGE_SIZE = 24;
export const Professionals = () => {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const canCreate = tenant && ['OWNER', 'ADMIN'].includes(tenant.role);
  const { open } = useOverlay('create-professional-modal');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [serviceId, setServiceId] = useState('all');
  const serviceOptions = useQuery({
    queryKey: ['services', tenant?.id, 'professional-filter'],
    enabled: !!tenant?.id,
    queryFn: async ({ signal }) => {
      const services: import('@/features/services/types/services.types').Service[] = [];
      for (let skip = 0; ; skip += PAGE_SIZE) {
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenant?.id) throw new Error('El espacio cambió.');
        const result = await servicesApi.getAll({ skip, take: PAGE_SIZE, orderBy: 'name', order: 'asc' });
        if (signal.aborted || useAuthStore.getState().session?.activeTenant?.id !== tenant?.id) throw new Error('El espacio cambió.');
        services.push(...result.data);
        if (result.data.length < PAGE_SIZE) return services;
      }
    },
  });
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
  } = useQuery({
    queryKey: ['professionals', tenant?.id, { query, status, serviceId, sort, page }],
    enabled: !!tenant?.id,
    queryFn: () =>
      professionalApi.getListing({
        query: query || undefined,
        isActive: status === 'all' ? undefined : status === 'active',
        serviceId: serviceId === 'all' ? undefined : serviceId,
        orderBy: sort === 'name' ? 'name' : 'createdAt',
        sortOrder: sort === 'name' ? 'asc' : 'desc',
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
  });
  const professionals = response?.data ?? [];
  const total = response?.meta.total ?? 0;
  const active = search !== '' || status !== 'all' || serviceId !== 'all' || sort !== 'name';
  const loading = isLoading || query !== searchQuery;
  useEffect(() => {
    if (response && page > 0 && page * PAGE_SIZE >= total) setPage(Math.max(0, Math.ceil(total / PAGE_SIZE) - 1));
  }, [response, total, page]);
  const clear = () => {
    setSearch('');
    setStatus('all');
    setServiceId('all');
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
            aria-label="Buscar profesionales por nombre o email"
            placeholder="Buscar por nombre o email..."
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
            label="Servicio asignado"
            value={serviceId}
            onValueChange={change(setServiceId)}
            icon={<TagIcon className="size-4" />}
            options={[
              { value: 'all', label: 'Todos los servicios' },
              ...(serviceOptions.data ?? []).map((service) => ({ value: service.id, label: service.name })),
            ]}
          />
          {serviceOptions.isError && (
            <Button variant="secondary" size="sm" onClick={() => void serviceOptions.refetch()}>
              Reintentar servicios
            </Button>
          )}
          <Select
            label="Ordenar por"
            value={sort}
            onValueChange={change(setSort)}
            icon={<BarsArrowUpIcon className="size-4" />}
            options={[
              { value: 'name', label: 'Nombre A–Z' },
              { value: 'newest', label: 'Más recientes' },
            ]}
          />
          {canCreate && (
          <Button variant="primary" onClick={open} icon={<PlusIcon className="size-5" />} iconPosition="left">
            Nuevo Profesional
          </Button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {loading
            ? 'Buscando profesionales...'
            : isError
              ? 'Resultados no disponibles'
              : `${total} ${total === 1 ? 'profesional encontrado' : 'profesionales encontrados'}`}
        </p>
        {active && (
          <Button variant="secondary" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-10" role="status" aria-label="Cargando profesionales">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <p>No se pudieron cargar los profesionales.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : professionals.length === 0 ? (
        <div className="space-y-2 py-10 text-center">
          <p className="font-semibold text-gray-600">No hemos encontrado profesionales</p>
          <p className="text-gray-500">
            {active ? 'Probá con otros filtros o cambiá la búsqueda.' : 'Agregá tu primer profesional para comenzar.'}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <ProfessionalsTable professionals={professionals} />
          </div>
          <div className="space-y-3 md:hidden">
            {professionals.map((professional) => (
              <ProfessionalsCard key={professional.id} professional={professional} />
            ))}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-sm text-gray-500">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total} profesionales
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
