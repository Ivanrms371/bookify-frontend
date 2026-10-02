import { useEffect, useState } from 'react';
import { useCustomers } from '../hooks/use-customers';
import { CustomersTable } from './table/customers-table';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui/spinner';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { CustomerList } from './list/customer-list';
import { CustomersHeader, type BookingActivity, type CustomerSort, type CustomerStatus } from './customers-header';

const PAGE_SIZE = 24;

export const Customers = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('all');
  const [activity, setActivity] = useState<BookingActivity>('all');
  const [sort, setSort] = useState<CustomerSort>('name');
  const [page, setPage] = useState(0);
  // Debounce the page reset with the search so an old query cannot fetch a new page.
  const criteria = useDebounce(search.trim(), 300);
  const [previousCriteria, setPreviousCriteria] = useState(criteria);
  if (criteria !== previousCriteria) {
    setPreviousCriteria(criteria);
    setPage(0);
  }
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useCustomers({
    query: criteria || undefined,
    status,
    bookingActivity: activity,
    orderBy: sort === 'name' ? 'name' : sort === 'newest' ? 'createdAt' : sort === 'last-visit' ? 'lastVisitAt' : 'totalSpent',
    order: sort === 'name' ? 'asc' : 'desc',
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const customers = response?.data ?? [];
  const total = response?.meta.total ?? 0;
  const active = search !== '' || status !== 'all' || activity !== 'all' || sort !== 'name';
  const searching = criteria !== search.trim();

  useEffect(() => {
    if (response && page > 0 && page * PAGE_SIZE >= total) {
      setPage(Math.max(0, Math.ceil(total / PAGE_SIZE) - 1));
    }
  }, [response, total, page]);

  const clear = () => {
    setSearch('');
    setStatus('all');
    setActivity('all');
    setSort('name');
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <CustomersHeader
        search={search}
        status={status}
        activity={activity}
        sort={sort}
        onSearchChange={setSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(0);
        }}
        onActivityChange={(value) => {
          setActivity(value);
          setPage(0);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(0);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {isLoading || searching
            ? 'Buscando clientes...'
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
      {isLoading || searching ? (
        <div className="flex justify-center py-10" role="status" aria-label="Cargando clientes">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <p className="text-gray-600">No se pudieron cargar los clientes.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : customers.length === 0 ? (
        <div className="space-y-2 py-10 text-center">
          <p className="text-xl font-semibold text-gray-600">No hemos encontrado clientes</p>
          <p className="text-gray-500">
            {active ? 'Probá con otros filtros o cambiá la búsqueda.' : 'Agregá tu primer cliente para comenzar.'}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <CustomersTable customers={customers} />
          </div>
          <div className="md:hidden">
            <CustomerList customers={customers} />
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-sm text-gray-500">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total} clientes
              </p>
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={(page + 1) * PAGE_SIZE >= total}
                onClick={() => setPage((current) => current + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
