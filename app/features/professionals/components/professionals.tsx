import { can } from '@/core/auth/permissions';
import { useBillingSummary } from '@/features/billing/hooks/use-billing-subscription';
import { hasFreeResourceLimit } from '@/features/billing/utils/resource-limit';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { ProfessionalsCard } from './list/professionals-card';
import { ProfessionalsTable } from './table/professionals-table';
import { Button } from '@/shared/components/ui';
import { TableSkeleton } from '@/shared/components/ui/table';

import { PROFESSIONALS_PAGE_SIZE as PAGE_SIZE } from '../utils/professionals-page-model';
import { useProfessionalsPage } from '../hooks/use-professionals-page';
import { useProfessionalServiceOptions } from '../hooks/use-professional-service-options';
import { ProfessionalsHeader } from './professionals-header';

export const Professionals = () => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  if (!tenantId) return <TableSkeleton label="Cargando profesionales..." columns={[{ label: 'Profesionales' }]} />;
  return <ProfessionalsPage key={tenantId} />;
};

function ProfessionalsPage() {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const canCreate = can(tenant, 'professional:create');
  const { open } = useOverlay('create-professional-modal');
  const planLimit = useOverlay('plan-limit-modal');
  const billing = useBillingSummary(can(tenant, 'billing:read'));
  const addProfessional = () => {
    if (tenant && hasFreeResourceLimit(billing.data, 'professionals')) {
      planLimit.open({ resource: 'professionals', tenantId: tenant.id });
    } else open();
  };
  const desktop = useMediaQuery('(min-width: 768px)');
  const serviceOptions = useProfessionalServiceOptions();
  const model = useProfessionalsPage();
  const { search, status, serviceId, sort, page, professionals, total, active, loading, setSearch, setPage, clear } = model;
  const { isError, isFetching, isPlaceholderData, refetch } = model.query;
  return (
    <div className="space-y-4">
      <ProfessionalsHeader
        search={search}
        status={status}
        serviceId={serviceId}
        sort={sort}
        services={serviceOptions.data ?? []}
        servicesLoading={serviceOptions.isLoading}
        servicesError={serviceOptions.isError}
        canCreate={canCreate}
        onSearchChange={setSearch}
        onFiltersChange={model.applyFilters}
        onRetryServices={() => void serviceOptions.refetch()}
        onCreate={addProfessional}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {loading
            ? 'Buscando profesionales...'
            : isPlaceholderData
              ? 'Cargando resultados...'
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
        <TableSkeleton
          label="Cargando profesionales..."
          tableClassName="min-w-225"
          columns={[
            { label: 'Nombre', variant: 'avatar', width: 'w-32' },
            { label: 'Email', width: 'w-40' },
            { label: 'Teléfono', width: 'w-28' },
            { label: 'Estado', variant: 'badge' },
            { label: 'Acceso', variant: 'badge' },
            { label: 'Acciones', variant: 'actions', align: 'right' },
          ]}
        />
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <p>No se pudieron cargar los profesionales.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : professionals.length === 0 ? (
        <EmptyState
          icon={<UsersIcon />}
          title="No hemos encontrado profesionales"
          description={active ? 'Probá con otros filtros o cambiá la búsqueda.' : 'Agregá tu primer profesional para comenzar.'}
        />
      ) : (
        <>
          {isFetching && (
            <p className="text-sm text-gray-500" role="status">
              Actualizando profesionales...
            </p>
          )}
          <div aria-busy={isFetching}>
            {desktop ? (
              <ProfessionalsTable professionals={professionals} />
            ) : (
              <div className="space-y-3">
                {professionals.map((professional) => (
                  <ProfessionalsCard key={professional.id} professional={professional} />
                ))}
              </div>
            )}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-sm text-gray-500">
                {isPlaceholderData
                  ? 'Cargando página...'
                  : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} de ${total} profesionales`}
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
