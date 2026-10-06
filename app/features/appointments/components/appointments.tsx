import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useAgenda } from '../hooks/use-agenda';
import { AGENDA_PAGE_SIZE as PAGE_SIZE } from '../utils/agenda-model';
import { AppointmentList } from './appointment-list';
import { AppointmentTable } from './appointment-table';
import { CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { TableSkeleton } from '@/shared/components/ui/table';
import { ScheduleHeader } from './schedule-header';

export const Appointments = () => {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  if (!tenant) return <TableSkeleton label="Cargando agenda..." columns={[{ label: 'Citas' }]} />;
  const timeZone = tenant.timeZone ?? 'America/Montevideo';
  return <Agenda key={`${tenant.id}-${timeZone}`} timeZone={timeZone} />;
};

function Agenda({ timeZone }: { timeZone: string }) {
  const agenda = useAgenda(timeZone);
  const desktop = useMediaQuery('(min-width: 768px)');
  const { selectedDate, state, order, professionalId, page, appointments, total, filtersActive, setPage, onNext, onPrevious, onToday } =
    agenda;
  const { isLoading, isError, isFetching, isPlaceholderData, refetch } = agenda.query;
  const {
    data: professionals = [],
    isLoading: professionalsLoading,
    isError: professionalsError,
    refetch: retryProfessionals,
  } = agenda.professionals;
  const loading = isLoading || agenda.recoveringPage;

  return (
    <div className="space-y-4">
      <ScheduleHeader
        selectedDate={selectedDate}
        onNext={onNext}
        onPrevious={onPrevious}
        onToday={onToday}
        state={state}
        order={order}
        professionalId={professionalId}
        professionals={professionals}
        professionalsLoading={professionalsLoading}
        onFiltersChange={agenda.applyFilters}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500" role="status">
          {loading
            ? 'Buscando citas...'
            : isPlaceholderData
              ? 'Cargando resultados...'
              : isError
                ? 'Resultados no disponibles'
                : `${total} ${total === 1 ? 'cita encontrada' : 'citas encontradas'}`}
        </p>
        {(filtersActive || order !== 'latest') && (
          <Button variant="secondary" size="sm" onClick={agenda.clearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>
      {professionalsError && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>No se pudieron cargar los profesionales.</span>
          <Button variant="secondary" size="sm" onClick={() => void retryProfessionals()}>
            Reintentar
          </Button>
        </div>
      )}
      {loading ? (
        <TableSkeleton
          label="Cargando citas..."
          mobileTitleColumn={2}
          columns={[
            { label: 'Fecha', width: 'w-24' },
            { label: 'Hora', width: 'w-28' },
            { label: 'Cliente', width: 'w-32', secondaryLine: true },
            { label: 'Servicio', width: 'w-32' },
            { label: 'Estado', variant: 'badge' },
            { label: 'Precio', width: 'w-20' },
            { label: 'Acciones', variant: 'actions', align: 'right' },
          ]}
        />
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <Text className="text-gray-600">No se pudieron cargar las citas.</Text>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<CalendarDateRangeIcon />}
          title="No hemos encontrado citas"
          description={
            filtersActive ? 'Probá con otros filtros o seleccioná otra fecha.' : 'Prueba a seleccionar otra fecha para ver las citas.'
          }
        />
      ) : (
        <>
          {isFetching && (
            <p className="text-sm text-gray-500" role="status">
              Actualizando citas...
            </p>
          )}
          <div aria-busy={isFetching}>
            {desktop ? <AppointmentTable appointments={appointments} /> : <AppointmentList appointments={appointments} />}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Text className="text-sm text-gray-500">
                {isPlaceholderData
                  ? 'Cargando página...'
                  : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} de ${total} citas`}
              </Text>
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
