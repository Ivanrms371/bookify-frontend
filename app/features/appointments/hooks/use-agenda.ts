import { useSearchParams } from 'react-router';
import { useEffect, useReducer } from 'react';
import { useAppointments } from './use-appointments';
import { useCalendarProfessionals } from '@/features/professionals/hooks/use-calendar-professionals';
import { agendaParams, agendaReducer, initialAgendaState, notificationAgendaSelection, lastAgendaPage, moveAgendaDate, todayInTimeZone } from '../utils/agenda-model';
import type { AgendaFilters } from '../types/agenda.types';

export function useAgenda(timeZone: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(agendaReducer, timeZone, (zone) => {
    const selection = notificationAgendaSelection(searchParams);
    return { ...initialAgendaState(selection.date ?? todayInTimeZone(zone)), professionalId: selection.professionalId ?? 'all' };
  });
  useEffect(() => {
    if (!searchParams.has('notificationDate') && !searchParams.has('notificationProfessionalId')) return;
    const selection = notificationAgendaSelection(searchParams);
    if (selection.date) dispatch({ type: 'date', date: selection.date });
    dispatch({ type: 'filters', filters: { state: 'all', order: 'latest', professionalId: selection.professionalId ?? 'all' } });
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.delete('notificationDate');
      next.delete('notificationProfessionalId');
      return next;
    }, { replace: true });
  }, [searchParams, setSearchParams]);
  const query = useAppointments(agendaParams(state), timeZone);
  const professionals = useCalendarProfessionals();
  const total = query.data?.meta.total ?? 0;
  const lastPage = lastAgendaPage(total);
  const recoveringPage = !!query.data && !query.isPlaceholderData && state.page > lastPage;

  useEffect(() => {
    if (recoveringPage) dispatch({ type: 'page', page: lastPage });
  }, [recoveringPage, lastPage]);

  return {
    ...state,
    query,
    professionals,
    total,
    appointments: query.data?.data ?? [],
    recoveringPage,
    filtersActive: state.state !== 'all' || state.professionalId !== 'all',
    applyFilters: (filters: AgendaFilters) => dispatch({ type: 'filters', filters }),
    clearFilters: () => dispatch({ type: 'clear' }),
    setPage: (page: number) => dispatch({ type: 'page', page }),
    onNext: () => dispatch({ type: 'date', date: moveAgendaDate(state.selectedDate, 1) }),
    onPrevious: () => dispatch({ type: 'date', date: moveAgendaDate(state.selectedDate, -1) }),
    onToday: () => dispatch({ type: 'date', date: todayInTimeZone(timeZone) }),
  };
}
