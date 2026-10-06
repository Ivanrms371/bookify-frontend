import { addDays, format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import type { AgendaAction, AgendaState } from '../types/agenda.types';
import type { GetAllAppointmentsParams } from '../types/appointments-types';

export const AGENDA_PAGE_SIZE = 20;
const defaults = { state: 'all', order: 'latest', professionalId: 'all' } as const;
export const todayInTimeZone = (timeZone: string, now = new Date()) => formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
export const moveAgendaDate = (date: string, days: number) => format(addDays(parseISO(date), days), 'yyyy-MM-dd');
export const initialAgendaState = (date: string): AgendaState => ({ ...defaults, selectedDate: date, page: 0 });

export function agendaReducer(state: AgendaState, action: AgendaAction): AgendaState {
  switch (action.type) {
    case 'date':
      return action.date === state.selectedDate ? state : { ...state, selectedDate: action.date, page: 0 };
    case 'filters':
      return { ...state, ...action.filters, page: 0 };
    case 'clear':
      return { ...state, ...defaults, page: 0 };
    case 'page':
      return { ...state, page: Math.max(0, action.page) };
  }
}

export function agendaParams(state: AgendaState): GetAllAppointmentsParams {
  return {
    date: state.selectedDate,
    ...(state.state !== 'all' ? { state: state.state } : {}),
    ...(state.professionalId !== 'all' ? { professionalId: state.professionalId } : {}),
    orderBy: state.order === 'latest' ? 'createdAt' : 'startsAt',
    order: state.order === 'hour-asc' ? 'asc' : 'desc',
    skip: state.page * AGENDA_PAGE_SIZE,
    take: AGENDA_PAGE_SIZE,
  };
}

export function canKeepAppointmentResults(
  tenantId: string | undefined,
  params: GetAllAppointmentsParams,
  previousKey: readonly unknown[],
  timeZone?: string,
): boolean {
  if (!tenantId || previousKey[1] !== tenantId || previousKey[3] !== timeZone) return false;
  const previous = previousKey[2] as GetAllAppointmentsParams | undefined;
  if (!previous) return false;
  const criteria = ['date', 'query', 'state', 'professionalId', 'orderBy', 'order', 'take'] as const;
  return criteria.every((key) => previous[key] === params[key]);
}

export const lastAgendaPage = (total: number) => Math.max(0, Math.ceil(total / AGENDA_PAGE_SIZE) - 1);
