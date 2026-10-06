import { useEffect, useReducer } from 'react';
import { useAppointments } from './use-appointments';
import { useCalendarProfessionals } from '@/features/professionals/hooks/use-calendar-professionals';
import { agendaParams, agendaReducer, initialAgendaState, lastAgendaPage, moveAgendaDate, todayInTimeZone } from '../utils/agenda-model';
import type { AgendaFilters } from '../types/agenda.types';

export function useAgenda(timeZone: string) {
  const [state, dispatch] = useReducer(agendaReducer, timeZone, (zone) => initialAgendaState(todayInTimeZone(zone)));
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
