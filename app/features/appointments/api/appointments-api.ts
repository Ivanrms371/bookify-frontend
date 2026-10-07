import { httpClient } from '@/core/http/httpClient';
import type { CreateAppointmentInput } from '../schemas/create-appointment-schema';
import type { RescheduleAppointmentInput } from '../schemas/reschedule-appointment-schema';
import type { Appointment } from '../types/appointments-types';
import type { GetAllAppointmentsResponse, GetAllAppointmentsParams } from '../types/appointments-types';

export const appointmentsApi = {
  getAll: (params: GetAllAppointmentsParams, options: { signal?: AbortSignal; tenantId?: string } = {}) =>
    httpClient.get<GetAllAppointmentsResponse>('/appointments', { params, signal: options.signal, expectedTenantId: options.tenantId }),

  getById: (id: string, options: { signal?: AbortSignal; tenantId?: string } = {}) =>
    httpClient.get<Appointment>(`/appointments/${id}`, { signal: options.signal, expectedTenantId: options.tenantId }),

  changeStatus: (id: string, status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW', tenantId?: string) =>
    httpClient.patch<Appointment>(`/appointments/${id}/status`, { status }, { expectedTenantId: tenantId, skipAuthRetry: true }),

  create: (input: CreateAppointmentInput) => httpClient.post('/appointments', input),

  reschedule: (id: string, input: RescheduleAppointmentInput) => httpClient.patch<Appointment>(`/appointments/${id}/reschedule`, input),

  cancel: (id: string, input: { cancellationReason?: string } = {}) => httpClient.patch<Appointment>(`/appointments/${id}/cancel`, input),
};
