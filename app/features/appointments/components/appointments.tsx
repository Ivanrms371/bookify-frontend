import { useState } from 'react';
import { useDateNavigator } from '../hooks/use-date-navigator';
import { AppointmentList } from './appointment-list';
import { AppointmentTable } from './appointment-table';
import { useAppointments } from '../hooks/use-appointments';
import { useCalendarProfessionals } from '@/features/professionals/hooks/use-calendar-professionals';
import { CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui/spinner';
import { ScheduleHeader, type CalendarState, type CalendarOrder } from './schedule-header';

const PAGE_SIZE = 20;

export const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [state, setState] = useState<CalendarState>('all');
  const [order, setOrder] = useState<CalendarOrder>('latest');
  const [professionalId, setProfessionalId] = useState('all');
  const [page, setPage] = useState(0);
  const changeDate = (date: Date) => {
    setSelectedDate(date);
    setPage(0);
  };
  const { onNext, onPrevious, onToday } = useDateNavigator(selectedDate, changeDate);
  const {
    data: professionals = [],
    isLoading: professionalsLoading,
    isError: professionalsError,
    refetch: retryProfessionals,
  } = useCalendarProfessionals();
  const {
    data: appointmentsData,
    isLoading,
    isError,
    refetch,
  } = useAppointments({
    date: selectedDate.toISOString(),
    ...(state !== 'all' ? { state } : {}),
    ...(professionalId !== 'all' ? { professionalId } : {}),
    orderBy: order === 'latest' ? 'createdAt' : 'startsAt',
    order: order === 'hour-asc' ? 'asc' : 'desc',
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const appointments = appointmentsData?.data ?? [];
  const total = appointmentsData?.meta.total ?? 0;
  const filtersActive = state !== 'all' || professionalId !== 'all';

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
        onStateChange={(value) => {
          setState(value);
          setPage(0);
        }}
        onOrderChange={(value) => {
          setOrder(value);
          setPage(0);
        }}
        onProfessionalChange={(value) => {
          setProfessionalId(value);
          setPage(0);
        }}
      />
      {professionalsError && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>No se pudieron cargar los profesionales.</span>
          <Button variant="secondary" size="sm" onClick={() => void retryProfessionals()}>
            Reintentar
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center py-10" role="status" aria-label="Cargando citas">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="space-y-3 py-10 text-center" role="alert">
          <Text className="text-gray-600">No se pudieron cargar las citas.</Text>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="mx-auto mt-2 flex flex-col w-full gap-10">
          <AppointmentTable appointments={appointments} />

          <div className="w-full flex flex-col items-center">
            <CalendarDateRangeIcon className="mb-2 size-10 text-gray-500" />
            <Text className="mb-1 text-xl font-semibold text-gray-600">No hemos encontrado citas</Text>
            <Text className="mb-2 max-w-sm text-base font-medium text-gray-500">
              {filtersActive ? 'Probá con otros filtros o seleccioná otra fecha.' : 'Prueba a seleccionar otra fecha para ver las citas.'}
            </Text>
            {filtersActive && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setState('all');
                  setProfessionalId('all');
                  setPage(0);
                }}
              >
                Limpiar filtros
              </Button>
            )}
            {page > 0 && (
              <Button variant="secondary" size="sm" onClick={() => setPage(0)}>
                Volver al inicio
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="block md:hidden">
            <AppointmentList
              appointments={appointments}
              selectedDate={selectedDate}
              onNext={onNext}
              onPrevious={onPrevious}
              onToday={onToday}
            />
          </div>
          <div className="hidden md:block">
            <AppointmentTable appointments={appointments} />
          </div>
          {total > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Text className="text-sm text-gray-500">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total} citas
              </Text>
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
