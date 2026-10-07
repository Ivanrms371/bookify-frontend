import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useCustomersPage } from '../hooks/use-customers-page';
import { CUSTOMERS_PAGE_SIZE as PAGE_SIZE } from '../utils/customers-page-model';
import { CustomersTable } from './table/customers-table';
import { Button } from '@/shared/components/ui';
import { TableSkeleton } from '@/shared/components/ui/table';
import { CustomerList } from './list/customer-list';
import { CustomersHeader } from './customers-header';

export const Customers = () => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  if (!tenantId) return <TableSkeleton label="Cargando clientes..." columns={[{ label: 'Clientes' }]} />;
  return <CustomersPage key={tenantId} />;
};

function CustomersPage() {
  const desktop = useMediaQuery('(min-width: 768px)');
  const model = useCustomersPage();
  const { search, status, activity, sort, page, customers, total, active, loading, setSearch, setPage, clear } = model;
  const { isError, isFetching, isPlaceholderData, refetch } = model.query;

  return (
    <div className="space-y-4">
      <CustomersHeader
        search={search}
        status={status}
        activity={activity}
        sort={sort}
        onSearchChange={setSearch}
        onFiltersChange={model.applyFilters}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {loading
            ? 'Buscando clientes...'
            : isPlaceholderData
              ? 'Cargando resultados...'
              : isError
                ? 'Resultados no disponibles'
                : `${total} ${total === 1 ? 'cliente encontrado' : 'clientes encontrados'}`}
        </p>
        {active && (
          <Button variant="secondary" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        )}
      </div>
      {loading ? (
        <TableSkeleton
          label="Cargando clientes..."
          tableClassName="min-w-[900px]"
          columns={[
            { label: 'Nombre', width: 'w-32' },
            { label: 'Email', width: 'w-40' },
            { label: 'Teléfono', width: 'w-28' },
            { label: 'Próxima cita', width: 'w-32' },
            { label: 'Última visita', width: 'w-24' },
            { label: 'Total Gastado', width: 'w-20' },
            { label: 'Acciones', variant: 'actions', align: 'right' },
          ]}
        />
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <p className="text-gray-600">No se pudieron cargar los clientes.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<UserGroupIcon />}
          title="No hemos encontrado clientes"
          description={active ? 'Probá con otros filtros o cambiá la búsqueda.' : 'Agregá tu primer cliente para comenzar.'}
        />
      ) : (
        <>
          {isFetching && (
            <p className="text-sm text-gray-500" role="status">
              Actualizando clientes...
            </p>
          )}
          <div aria-busy={isFetching}>
            {desktop ? (
              <div className="overflow-x-auto">
                <CustomersTable customers={customers} />
              </div>
            ) : (
              <CustomerList customers={customers} />
            )}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-sm text-gray-500">
                {isPlaceholderData
                  ? 'Cargando página...'
                  : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} de ${total} clientes`}
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
